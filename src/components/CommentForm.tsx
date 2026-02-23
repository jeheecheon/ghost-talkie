import { useState } from "react";
import type { Address } from "viem";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import usePublishComment from "@/hooks/usePublishComment";
import { cn } from "@/utils/misc";
import useRequireNostrIdentity from "@/hooks/useRequireNostrIdentity";

type CommentFormProps = {
  className?: string;
  profileAddress: Address;
};

export default function CommentForm({
  className,
  profileAddress,
}: CommentFormProps) {
  const [content, setContent] = useState("");

  const { isPending, mutate: requireNostrIdentity } = useRequireNostrIdentity();
  const { mutateAsync: publishComment } = usePublishComment(profileAddress);

  return (
    <form
      className={cn("flex flex-col gap-y-2", className)}
      onSubmit={handleSubmit}
    >
      <Textarea
        placeholder="Leave a comment..."
        rows={3}
        maxLength={500}
        aria-label="Comment"
        onChange={handleTextareaChange}
      />
      <Button className="self-end" type="submit" size="sm" disabled={isPending}>
        {isPending ? "Posting..." : "Post"}
      </Button>
    </form>
  );

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value.trim());
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    requireNostrIdentity(async (identity) => {
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
