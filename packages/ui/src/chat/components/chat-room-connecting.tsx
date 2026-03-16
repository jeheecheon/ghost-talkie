import { Loader2 } from "lucide-react";
import { cn } from "@workspace/lib/cn";
import GhostIcon from "@workspace/ui/icons/ghost-icon";

type ChatRoomConnectingProps = {
  className?: string;
};

export default function ChatRoomConnecting({
  className,
}: ChatRoomConnectingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <GhostIcon className="size-12" />
      <Loader2 className="text-muted-foreground size-5 animate-spin" />
      <p className="text-muted-foreground text-sm">
        Connecting to the other side...
      </p>
    </div>
  );
}
