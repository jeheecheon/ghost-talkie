import { useState } from "react";
import { isAddressEqual, type Address } from "viem";
import { useConnection } from "wagmi";
import { Button } from "@/components/ui/button";
import useRequireWallet from "@/hooks/useRequireWallet";
import useNostrIdentity from "@/hooks/useNostrIdentity";
import useProfileComments from "@/hooks/useProfileComments";
import { shortenAddress } from "@/utils/address";
import { formatRelativeTime } from "@/utils/time";
import { safelyRunAsync } from "@/utils/misc";

type CommentSectionProps = {
  profileAddress: Address;
};

export default function CommentSection({
  profileAddress,
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { address } = useConnection();
  const { execute: executeWithWallet } = useRequireWallet();
  const { identity, requestIdentity } = useNostrIdentity();
  const { comments, isLoading, publishComment } =
    useProfileComments(profileAddress);

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Comments</h2>

      <div className="flex flex-col gap-y-2">
        <textarea
          className="bg-background placeholder:text-muted-foreground focus:border-ring min-h-20 w-full resize-y rounded-lg border p-3 text-sm focus:outline-none"
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
          className="self-end"
          size="sm"
          disabled={!commentText.trim() || !identity || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>

      {isLoading ? (
        // TODO: show loading skeleton
        <p className="text-muted-foreground text-sm">Loading comments...</p>
      ) : comments.length === 0 ? (
        // TODO: show empty state instead of text
        <p className="text-muted-foreground text-sm">No comments yet</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => {
            const isOwner =
              isAddressEqual(comment.walletAddress, profileAddress) &&
              comment.isVerified;

            return (
              <li key={comment.id}>
                <section className="bg-muted space-y-1 rounded-lg p-3">
                  <div className="flex items-center gap-x-2">
                    <span className="text-sm font-medium">
                      {shortenAddress(comment.walletAddress)}
                    </span>
                    {isOwner && (
                      <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                        Owner
                      </span>
                    )}
                    <span className="text-muted-foreground text-xs">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </section>
              </li>
            );
          })}
        </ul>
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
