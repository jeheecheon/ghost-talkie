import { useEffect, useRef, useState } from "react";
import { type ActionSender, joinRoom } from "trystero/nostr";
import type { Nullable } from "@/types/misc";
import type { ChatMessage, ChatPayload } from "@/types/chat";

interface UseTrysteroRoomArgs {
  roomId: string;
  sender: string;
  enabled?: boolean;
}

interface UseTrysteroRoomReturn {
  peers: string[];
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
}

export function useTrysteroRoom({
  roomId,
  sender,
  enabled,
}: UseTrysteroRoomArgs): UseTrysteroRoomReturn {
  const [peers, setPeers] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const sendChatRef = useRef<Nullable<ActionSender<ChatPayload>>>(null);

  useEffect(() => {
    if (!enabled || !roomId) {
      return;
    }

    const destroyRoom = initRoom();

    return () => {
      destroyRoom();
    };
  }, [enabled, roomId]);

  return {
    peers,
    messages,
    sendMessage,
  };

  function initRoom() {
    const room = joinRoom({ appId: "ghosttalkie" }, roomId);
    const [sendChat, getChat] = room.makeAction<ChatPayload>("chat");
    sendChatRef.current = sendChat;

    getChat((data) => {
      setMessages((prev) => [
        ...prev,
        createChatMessage({ text: data.text, sender: data.sender }),
      ]);
    });

    room.onPeerJoin((peerId) => {
      setPeers((prev) => [...prev, peerId]);
    });

    room.onPeerLeave((peerId) => {
      setPeers((prev) => prev.filter((id) => id !== peerId));
    });

    return function destroyRoom() {
      room.leave();
      sendChatRef.current = null;
      setPeers([]);
      setMessages([]);
    };
  }

  function sendMessage(text: string) {
    if (!sendChatRef.current || !text.trim()) {
      return;
    }

    sendChatRef.current({ text, sender });
    setMessages((prev) => [...prev, createChatMessage({ text, sender })]);
  }

  function createChatMessage(args: {
    text: string;
    sender: string;
  }): ChatMessage {
    const { text, sender } = args;

    return {
      id: crypto.randomUUID(),
      text,
      sender,
      timestamp: Date.now(),
    };
  }
}
