import { type PropsWithChildren, useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@workspace/ui/primitives/button";
import { cn } from "@workspace/lib/cn";

type ShareButtonProps = PropsWithChildren<{
  className?: string;
  url?: string;
}>;

export default function ShareButton({
  className,
  url,
  children = "Share",
}: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <Button
      className={cn("gap-2", className)}
      variant="outline"
      size="sm"
      onClick={handleShare}
    >
      <Share2 className="size-4" />
      {isCopied ? "Copied!" : children}
    </Button>
  );

  async function handleShare() {
    const shareUrl = url ?? window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: "GhostTalkie", url: shareUrl });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // User cancelled share dialog or clipboard access denied
    }
  }
}
