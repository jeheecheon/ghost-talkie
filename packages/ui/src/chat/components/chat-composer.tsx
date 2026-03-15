import type { KeyboardEvent as ReactKeyboardEvent, SubmitEvent } from "react";
import { useRef, useState } from "react";
import { Mic, MicOff, SendHorizontal } from "lucide-react";
import { Textarea } from "@workspace/ui/primitives/textarea";
import { Button } from "@workspace/ui/primitives/button";
import { cn } from "@workspace/lib/cn";

type ChatComposerProps = {
  className?: string;
  isMicOn: boolean;
  onSend: (text: string) => void;
  onToggleMic: () => void;
};

export default function ChatComposer({
  className,
  isMicOn,
  onSend,
  onToggleMic,
}: ChatComposerProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isComposingRef = useRef(false);
  const [content, setContent] = useState("");

  return (
    <form
      ref={formRef}
      className={cn("flex items-end border-t p-1.5", className)}
      onSubmit={handleSubmit}
    >
      <Textarea
        className="max-h-24 min-h-10 flex-1 resize-none overflow-y-auto border-0 focus-visible:ring-0"
        placeholder="Message..."
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStatus(true)}
        onCompositionEnd={handleCompositionStatus(false)}
      />
      <Button
        className="mb-2 shrink-0 p-4.5"
        variant="ghost"
        size="icon-xs"
        type="button"
        onClick={onToggleMic}
      >
        {isMicOn ? (
          <Mic className="size-5 text-green-500" />
        ) : (
          <MicOff className="size-5 text-red-300" />
        )}
      </Button>
      <Button
        className="mb-2 shrink-0 p-4.5"
        variant="ghost"
        size="icon-xs"
        type="submit"
        disabled={!content.trim().length}
      >
        <SendHorizontal className="size-5" />
      </Button>
    </form>
  );

  function handleCompositionStatus(isComposing: boolean) {
    return () => {
      isComposingRef.current = isComposing;
    };
  }

  function handleKeyDown(e: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !isComposingRef.current) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) {
      return;
    }

    onSend(trimmed);
    setContent("");
  }
}
