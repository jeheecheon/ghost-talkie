import { useEffect, useRef } from "react";
import type { RemotePeer } from "@workspace/domain/p2p/types";

export default function useRemoteAudio(remotePeers: readonly RemotePeer[]) {
  const audioElementsRef = useRef(new Map<string, HTMLAudioElement>());

  useEffect(() => {
    const audioElements = audioElementsRef.current;
    const peersWithStream = remotePeers.filter((p) => p.stream);
    const activePeerIds = new Set(peersWithStream.map((p) => p.peerId));

    for (const peer of peersWithStream) {
      if (audioElements.has(peer.peerId)) {
        continue;
      }

      const audio = new Audio();
      audio.srcObject = peer.stream;
      audio.autoplay = true;
      audioElements.set(peer.peerId, audio);
    }

    for (const [peerId, audio] of audioElements) {
      if (activePeerIds.has(peerId)) {
        continue;
      }

      audio.pause();
      audio.srcObject = null;
      audioElements.delete(peerId);
    }

    return () => {
      for (const audio of audioElements.values()) {
        audio.pause();
        audio.srcObject = null;
      }

      audioElements.clear();
    };
  }, [remotePeers]);
}
