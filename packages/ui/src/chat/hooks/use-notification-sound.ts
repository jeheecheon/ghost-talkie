import { useCallback, useRef } from "react";

type UseNotificationSoundArgs = {
  url: string;
};

export default function useNotificationSound({
  url,
}: UseNotificationSoundArgs) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef(url);

  if (urlRef.current !== url) {
    urlRef.current = url;
    audioRef.current = null;
  }

  const playNotification = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(urlRef.current);
    }

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, []);

  return { playNotification };
}
