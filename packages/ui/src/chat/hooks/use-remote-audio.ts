import { useEffect, useRef } from "react";
import type { RemotePeer } from "@workspace/domain/p2p/types";

export default function useRemoteAudio(
  remotePeers: readonly RemotePeer[],
  enabled = true,
) {
  const audioElementsRef = useRef(new Map<string, HTMLAudioElement>());

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const peersWithStream = remotePeers.filter((p) => p.stream);
    attachNewPeers(audioElementsRef.current, peersWithStream);
    removeStalePeers(audioElementsRef.current, peersWithStream);

    return () => {
      disposeAll(audioElementsRef.current);
    };
  }, [remotePeers, enabled]);
}

function attachNewPeers(
  audioElements: Map<string, HTMLAudioElement>,
  peers: RemotePeer[],
) {
  for (const peer of peers) {
    if (audioElements.has(peer.peerId)) {
      continue;
    }

    const audio = new Audio();
    audio.srcObject = peer.stream;
    audio.autoplay = true;
    audioElements.set(peer.peerId, audio);
  }
}

function removeStalePeers(
  audioElements: Map<string, HTMLAudioElement>,
  peers: RemotePeer[],
) {
  const activePeerIds = new Set(peers.map((p) => p.peerId));

  for (const [peerId, audio] of audioElements) {
    if (activePeerIds.has(peerId)) {
      continue;
    }

    disposeAudio(audio);
    audioElements.delete(peerId);
  }
}

function disposeAll(audioElements: Map<string, HTMLAudioElement>) {
  for (const audio of audioElements.values()) {
    disposeAudio(audio);
  }

  audioElements.clear();
}

function disposeAudio(audio: HTMLAudioElement) {
  audio.pause();
  audio.srcObject = null;
}
