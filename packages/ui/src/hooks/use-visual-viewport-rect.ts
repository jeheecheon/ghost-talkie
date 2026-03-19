import { useEffect, useState } from "react";

type VisualViewportRect = {
  height: string;
  top: string;
};

const DEFAULT_RECT: VisualViewportRect = { height: "100dvh", top: "0px" };

export default function useVisualViewportRect(
  enabled: boolean = true,
): VisualViewportRect {
  const [rect, setRect] = useState<VisualViewportRect>(DEFAULT_RECT);

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

      setRect({
        height: `${vv.height}px`,
        top: `${vv.offsetTop}px`,
      });
    }

    handleResize();
    vv.addEventListener("resize", handleResize);
    vv.addEventListener("scroll", handleResize);

    return () => {
      vv.removeEventListener("resize", handleResize);
      vv.removeEventListener("scroll", handleResize);
      setRect(DEFAULT_RECT);
    };
  }, [enabled]);

  return rect;
}
