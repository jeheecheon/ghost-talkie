import { shortenAddress } from "@workspace/lib/address";
import { cn } from "@workspace/lib/cn";
import type { ChatMessage } from "@workspace/domain/p2p/types";

type ChatBubbleProps = {
  className?: string;
  message: ChatMessage;
  isOwn: boolean;
};

export default function ChatBubble({
  className,
  message,
  isOwn,
}: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex",
        isOwn && "justify-end",
        !isOwn && "justify-start",
        className,
      )}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3 py-2",
          isOwn
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-accent space-y-0.5 rounded-bl-sm",
        )}
      >
        {!isOwn && (
          <p className="text-muted-foreground text-xs font-medium">
            {shortenAddress(message.sender)}
          </p>
        )}
        <p className="text-sm wrap-break-word whitespace-pre-wrap">
          {message.text}
        </p>
      </div>
    </div>
  );
}
