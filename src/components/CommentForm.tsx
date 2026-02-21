import { useRef } from "react";
import type { Address } from "viem";
import { useConnection } from "wagmi";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useRequireWallet from "@/hooks/useRequireWallet";
import useNostrIdentity from "@/hooks/useNostrIdentity";
import usePublishComment from "@/hooks/usePublishComment";
import { cn, safelyRunAsync } from "@/utils/misc";

type CommentFormProps = {
  className?: string;
  profileAddress: Address;
};

export default function CommentForm({
  className,
  profileAddress,
}: CommentFormProps) {
  const { address } = useConnection();
  const { execute: executeWithWallet } = useRequireWallet();
  const { identity, requestIdentity } = useNostrIdentity();
  const { mutate: publishComment, isPending } =
    usePublishComment(profileAddress);

  const commentTextRef = useRef<HTMLTextAreaElement>(null);
  const commentText = commentTextRef.current?.value ?? "";

  return (
    <form
      className={cn("flex flex-col gap-y-2", className)}
      onSubmit={handleSubmit}
    >
      <Textarea
        ref={commentTextRef}
        placeholder="Leave a comment..."
        rows={3}
        maxLength={500}
        aria-label="Comment"
        onFocus={handleTextareaFocus}
      />
      <Button
        className="self-end"
        type="submit"
        size="sm"
        disabled={!commentText.trim() || !identity || isPending}
      >
        {isPending ? "Posting..." : "Post"}
      </Button>
    </form>
  );

  function handleTextareaFocus() {
    if (!address) {
      return;
    }

    executeWithWallet(async () => {
      await safelyRunAsync(() => requestIdentity(address));
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!identity || !commentText.trim()) {
      return;
    }

    publishComment(
      { content: commentText.trim(), identity },
      {
        onSuccess: () => {
          if (!commentTextRef.current) {
            return;
          }
          commentTextRef.current.value = "";
        },
      },
    );
  }
}
