import { useCallback, useEffect, useRef, useState } from "react";
import { type ActionSender, joinRoom, selfId, type Room } from "trystero/nostr";
import type { Nullable } from "@/types/misc";

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
}

interface UseTrysteroRoomArgs {
  roomId: string;
  enabled: boolean;
}

interface UseTrysteroRoomReturn {
  peers: string[];
  messages: ChatMessage[];
  selfId: string;
  isConnected: boolean;
  sendMessage: (text: string) => void;
}

export function useTrysteroRoom({
  roomId,
  enabled,
}: UseTrysteroRoomArgs): UseTrysteroRoomReturn {
  const [peers, setPeers] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const roomRef = useRef<Nullable<Room>>(null);
  const sendChatRef = useRef<Nullable<ActionSender<{ text: string }>>>(null);

  useEffect(() => {
    if (!enabled || !roomId) {
      if (roomRef.current) {
        roomRef.current.leave();
        roomRef.current = null;
        sendChatRef.current = null;
      }
      return;
    }

    const room = joinRoom({ appId: "ghosttalkie" }, roomId);
    roomRef.current = room;

    const [sendChat, getChat] = room.makeAction<{ text: string }>("chat");
    sendChatRef.current = sendChat;

    getChat((data, peerId) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: data.text,
          sender: peerId,
          timestamp: Date.now(),
        },
      ]);
    });

    room.onPeerJoin((peerId) => {
      setPeers((prev) => [...prev, peerId]);
    });

    room.onPeerLeave((peerId) => {
      setPeers((prev) => prev.filter((id) => id !== peerId));
    });

    return () => {
      room.leave();
      roomRef.current = null;
      sendChatRef.current = null;
      setPeers([]);
    };
  }, [enabled, roomId]);

  const sendMessage = useCallback((text: string) => {
    if (!sendChatRef.current || !text.trim()) {
      return;
    }

    sendChatRef.current({ text });
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        sender: selfId,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  return {
    peers,
    messages,
    selfId,
    isConnected: peers.length > 0,
    sendMessage,
  };
}
