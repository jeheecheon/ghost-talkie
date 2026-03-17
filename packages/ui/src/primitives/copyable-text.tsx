import { type PropsWithChildren, useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@workspace/lib/cn";
import { toast } from "sonner";

type CopyableTextProps = PropsWithChildren<{
  className?: string;
  value: string;
  toastMessage?: string;
}>;

export default function CopyableText({
  className,
  value,
  toastMessage = "Copied to clipboard",
  children,
}: CopyableTextProps) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <button
      className={cn("inline-flex cursor-pointer items-center gap-1", className)}
      type="button"
      onClick={handleCopy}
    >
      {children}
      {isCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </button>
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success(toastMessage);
    } catch {
      toast.error("Failed to copy");
    }
  }
}
