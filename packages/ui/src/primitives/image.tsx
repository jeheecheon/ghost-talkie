import { useEffect, useRef, useState } from "react";
import { cn } from "@workspace/lib/cn";
import { Skeleton } from "@workspace/ui/primitives/skeleton";
import type { Nullable } from "@workspace/types/misc";

type ImageStatus = "loading" | "loaded" | "fallback";

type ImageProps = Omit<React.ComponentProps<"img">, "onError"> & {
  className?: string;
  fallbackSrc?: string;
};

export default function Image({
  className,
  src,
  alt,
  fallbackSrc = "/images/placeholder.png",
  ...props
}: ImageProps) {
  const imgRef = useRef<Nullable<HTMLImageElement>>(null);

  const [status, setStatus] = useState<ImageStatus>(() =>
    src ? "loading" : "fallback",
  );
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setStatus(src ? "loading" : "fallback");
  }, [src, fallbackSrc]);

  useEffect(() => {
    const img = imgRef.current;

    if (!src || !img?.complete) {
      return;
    }

    if (isValidImage(img)) {
      setStatus("loaded");
    } else {
      setStatus("fallback");
      setCurrentSrc(fallbackSrc);
    }
  }, [src, fallbackSrc]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        className={cn(
          "transition-opacity duration-200",
          status === "loading" && "opacity-0",
          (status === "loaded" || status === "fallback") &&
            "size-[inherit] [object-fit:inherit]",
        )}
        ref={imgRef}
        key={currentSrc}
        src={currentSrc}
        alt={alt}
        {...props}
        onLoad={handleLoaded}
        onError={handleError}
      />
      {status === "loading" && (
        <Skeleton className="absolute inset-0 size-full" />
      )}
    </div>
  );

  function handleLoaded() {
    if (status === "fallback") {
      return;
    }

    setStatus("loaded");
  }

  function handleError() {
    setStatus("fallback");
    setCurrentSrc(fallbackSrc);
  }
}

function isValidImage(img: HTMLImageElement) {
  return img.src && img.naturalWidth > 0 && img.naturalHeight > 0;
}
