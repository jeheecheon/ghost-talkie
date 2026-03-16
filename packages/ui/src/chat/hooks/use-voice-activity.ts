import { useEffect, useState } from "react";
import type { Nullable } from "@workspace/types/misc";

const VOLUME_THRESHOLD = 15;
const POLL_INTERVAL_MS = 100;

type VoiceActivityState = {
  isSpeaking: boolean;
};

export default function useVoiceActivity(
  stream: Nullable<MediaStream>,
): VoiceActivityState {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) {
      setIsSpeaking(false);
      return;
    }

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const interval = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);

      const average =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

      setIsSpeaking(average > VOLUME_THRESHOLD);
    }, POLL_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      source.disconnect();
      audioContext.close();
    };
  }, [stream]);

  return { isSpeaking };
}
