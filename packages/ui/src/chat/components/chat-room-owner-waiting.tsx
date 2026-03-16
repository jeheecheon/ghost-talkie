import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@workspace/ui/primitives/button";
import { cn } from "@workspace/lib/cn";
import GhostIcon from "@workspace/ui/icons/ghost-icon";

type ChatRoomOwnerWaitingProps = {
  className?: string;
};

export default function ChatRoomOwnerWaiting({
  className,
}: ChatRoomOwnerWaitingProps) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-6",
        className,
      )}
    >
      <GhostIcon className="size-16" />

      <p className="text-muted-foreground text-center text-sm">
        Waiting for a ghost to arrive...
      </p>

      <Button
        className="gap-2"
        variant="outline"
        size="sm"
        onClick={handleShare}
      >
        <Share2 className="size-4" />
        {isCopied ? "Copied!" : "Share room link"}
      </Button>
    </div>
  );

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: "GhostTalkie", url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // User cancelled share dialog or clipboard access denied
    }
  }
}
