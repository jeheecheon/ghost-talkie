import { useState } from "react";
import { isAddressEqual, type Address } from "viem";
import { useConnection } from "wagmi";
import { Button } from "@/components/ui/button";
import { useRequireWallet } from "@/hooks/useRequireWallet";
import { useNostrIdentity } from "@/hooks/useNostrIdentity";
import { useProfileComments } from "@/hooks/useProfileComments";
import { shortenAddress } from "@/utils/address";
import { formatRelativeTime } from "@/utils/time";
import { safelyRunAsync } from "@/utils/misc";

type CommentSectionProps = {
  profileAddress: Address;
};

function CommentSection({ profileAddress }: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { address } = useConnection();
  const { execute: executeWithWallet } = useRequireWallet();
  const { identity, requestIdentity } = useNostrIdentity();
  const { comments, isLoading, publishComment } =
    useProfileComments(profileAddress);

  return (
    <section className="flex w-full max-w-md flex-col gap-4">
      <h2 className="text-lg font-semibold">Comments</h2>

      <div className="flex flex-col gap-2">
        <textarea
          className="w-full min-h-20 resize-y rounded-lg border bg-background p-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none"
          placeholder="Leave a comment..."
          value={commentText}
          onChange={(e) => {
            setCommentText(e.target.value);
          }}
          onFocus={handleTextareaFocus}
          rows={3}
          maxLength={500}
          aria-label="Comment"
        />
        <Button
          size="sm"
          className="self-end"
          disabled={!commentText.trim() || !identity || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comments yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => {
            const isOwner =
              isAddressEqual(comment.walletAddress, profileAddress) &&
              comment.isVerified;

            return (
              <div key={comment.id} className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {shortenAddress(comment.walletAddress)}
                  </span>
                  {isOwner && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      Owner
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm">{comment.content}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );

  function handleTextareaFocus() {
    if (!address) {
      return;
    }

    executeWithWallet(async () => {
      await safelyRunAsync(() => requestIdentity(address));
    });
  }

  async function handleSubmit() {
    if (!identity || !commentText.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await publishComment(commentText.trim(), identity);
      setCommentText("");
    } catch {
      // TODO: show toast/error UI
    } finally {
      setIsSubmitting(false);
    }
  }
}

export default CommentSection;
