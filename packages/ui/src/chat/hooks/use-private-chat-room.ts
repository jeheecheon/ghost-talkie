import { useCallback, useEffect, useRef, useState } from "react";
import usePrevious from "react-use/lib/usePrevious";
import { PrivateChatRoom } from "@workspace/domain/p2p/chat-room";
import useRemoteAudio from "@workspace/ui/chat/hooks/use-remote-audio";
import {
  PeerRole,
  type ChatMessage,
  type ChatProof,
  type PrivateChatRoomState,
  type RemotePeer,
} from "@workspace/domain/p2p/types";
import type { Maybe, Nullable } from "@workspace/types/misc";

type UsePrivateChatRoomArgs = {
  chatProof: Maybe<ChatProof>;
  enabled?: boolean;
  audioEnabled?: boolean;
  onMessage?: (message: ChatMessage) => void;
  onRemotePeersChange?: (remotePeers: RemotePeer[], isOwner: boolean) => void;
};

type UsePrivateChatRoomResult = {
  roomState: Nullable<PrivateChatRoomState>;
  sendMessage: (text: string) => Promise<void>;
  respond: (peerId: string, accepted: boolean) => Promise<void>;
  toggleMic: () => Promise<void>;
  disableMic: () => Promise<void>;
};

export default function usePrivateChatRoom({
  chatProof,
  enabled = true,
  audioEnabled = true,
  onMessage,
  onRemotePeersChange,
}: UsePrivateChatRoomArgs): UsePrivateChatRoomResult {
  const [roomState, setRoomState] =
    useState<Nullable<PrivateChatRoomState>>(null);
  const prevRoomState = usePrevious(roomState);

  const roomRef = useRef<Nullable<PrivateChatRoom>>(null);

  const sendMessage = useCallback(async (text: string) => {
    return roomRef.current?.sendMessage(text);
  }, []);

  const respond = useCallback(async (peerId: string, accepted: boolean) => {
    return roomRef.current?.respond(peerId, accepted);
  }, []);

  const toggleMic = useCallback(async () => {
    return roomRef.current?.toggleMic();
  }, []);

  const disableMic = useCallback(async () => {
    return roomRef.current?.disableMic();
  }, []);

  useRemoteAudio(roomState?.remotePeers ?? [], audioEnabled);

  useEffect(() => {
    if (!chatProof || !enabled) {
      return;
    }

    roomRef.current = PrivateChatRoom.join({
      roomAddress: chatProof.roomAddress,
      chatProof,
      onStateChange: setRoomState,
    });

    return () => {
      roomRef.current?.destroy();
      roomRef.current = null;
      setRoomState(null);
    };
  }, [chatProof, enabled]);

  useEffect(() => {
    if (
      !roomState ||
      prevRoomState?.messages.length === roomState.messages.length
    ) {
      return;
    }

    const latest = roomState.messages.at(-1);
    if (!latest) {
      return;
    }

    onMessage?.(latest);
  }, [prevRoomState, roomState, onMessage]);

  useEffect(() => {
    if (!roomState || prevRoomState?.remotePeers === roomState.remotePeers) {
      return;
    }

    const isOwner = roomState.localPeer.role === PeerRole.Owner;
    onRemotePeersChange?.(roomState.remotePeers, isOwner);
  }, [prevRoomState, roomState, onRemotePeersChange]);

  return { roomState, sendMessage, respond, toggleMic, disableMic };
}
