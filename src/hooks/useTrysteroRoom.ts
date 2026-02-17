import { useCallback, useEffect, useRef, useState } from "react";
import { joinRoom, selfId } from "trystero/nostr";

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
}

interface UseTrysteroRoomOptions {
  roomId: string;
  enabled: boolean;
}

interface UseTrysteroRoomReturn {
  peers: string[];
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  selfId: string;
  isConnected: boolean;
}

export function useTrysteroRoom({
  roomId,
  enabled,
}: UseTrysteroRoomOptions): UseTrysteroRoomReturn {
  const [peers, setPeers] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const roomRef = useRef<ReturnType<typeof joinRoom> | null>(null);
  const sendChatRef = useRef<((data: { text: string }) => void) | null>(null);

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
    if (!sendChatRef.current || !text.trim()) return;

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
    sendMessage,
    selfId,
    isConnected: peers.length > 0,
  };
}
