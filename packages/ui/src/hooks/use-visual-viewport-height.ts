import { useEffect, useState } from "react";

export default function useVisualViewportHeight(enabled: boolean = true) {
  const [height, setHeight] = useState<string>("100dvh");

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const vv = window.visualViewport;
    if (!vv) {
      return;
    }

    function handleResize() {
      if (!vv) {
        return;
      }
      setHeight(`${vv.height}px`);
    }

    handleResize();
    vv.addEventListener("resize", handleResize);

    return () => {
      vv.removeEventListener("resize", handleResize);
      setHeight("100dvh");
    };
  }, [enabled]);

  return height;
}
