import { useState } from "react";
import type { Address } from "viem";
import { Textarea } from "@workspace/ui/primitives/textarea";
import { Button } from "@workspace/ui/primitives/button";
import { cn } from "@workspace/lib/cn";
import useWithNostrIdentity from "@workspace/ui/wallet/hooks/use-with-nostr-identity";
import usePublishComment from "@workspace/ui/comment/hooks/use-publish-comment";

type CommentFormProps = {
  className?: string;
  address: Address;
};

export default function CommentForm({ className, address }: CommentFormProps) {
  const [content, setContent] = useState("");

  const { isPending, withNostrIdentity } = useWithNostrIdentity();
  const { mutateAsync: publishComment } = usePublishComment(address);

  return (
    <form className={cn("relative", className)} onSubmit={handleSubmit}>
      <Textarea
        id="comment-textarea"
        className="pr-16 pb-2"
        placeholder="Leave a comment..."
        rows={1}
        maxLength={500}
        aria-label="Comment"
        value={content}
        onChange={handleTextareaChange}
      />
      <Button
        className="absolute right-2 bottom-1.5"
        type="submit"
        size="xs"
        disabled={isPending || !content.trim()}
      >
        {isPending ? "Posting..." : "Post"}
      </Button>
    </form>
  );

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    withNostrIdentity(async (identity) => {
      try {
        await publishComment({ content, identity });
        setContent("");
        // TODO: show success message with toast
      } catch (error) {
        // TODO: show error message with toast
        console.error(error);
      }
    });
  }
}
