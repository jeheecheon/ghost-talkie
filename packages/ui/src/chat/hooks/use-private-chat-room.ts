import { useCallback, useEffect, useRef, useState } from "react";
import { PrivateChatRoom } from "@workspace/domain/p2p/chat-room";
import type {
  ChatProof,
  PrivateChatRoomState,
} from "@workspace/domain/p2p/types";
import type { Maybe, Nullable } from "@workspace/types/misc";

type UsePrivateChatRoomArgs = {
  chatProof: Maybe<ChatProof>;
  enabled?: boolean;
};

type UsePrivateChatRoomResult = {
  roomState: Nullable<PrivateChatRoomState>;
  sendMessage: (text: string) => Promise<void>;
  respond: (peerId: string, accepted: boolean) => Promise<void>;
};

export default function usePrivateChatRoom({
  chatProof,
  enabled,
}: UsePrivateChatRoomArgs): UsePrivateChatRoomResult {
  const [roomState, setRoomState] =
    useState<Nullable<PrivateChatRoomState>>(null);

  const roomRef = useRef<Nullable<PrivateChatRoom>>(null);

  const sendMessage = useCallback(async (text: string) => {
    return roomRef.current?.sendMessage(text);
  }, []);
  const respond = useCallback(async (peerId: string, accepted: boolean) => {
    return roomRef.current?.respond(peerId, accepted);
  }, []);

  useEffect(() => {
    if (!chatProof || !enabled) {
      return;
    }

    roomRef.current = PrivateChatRoom.join({
      roomAddress: chatProof.roomAddress,
      chatProof: chatProof,
      onStateChange: setRoomState,
    });

    return () => {
      roomRef.current?.destroy();
      roomRef.current = null;
      setRoomState(null);
    };
  }, [chatProof, enabled]);

  return { roomState, sendMessage, respond };
}
