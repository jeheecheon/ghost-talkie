import { isAddressEqual, type Address } from "viem";
import useProfileComments from "@/hooks/useProfileComments";
import { shortenAddress } from "@/utils/address";
import { formatRelativeTime } from "@/utils/time";
import { cn } from "@/utils/misc";

type CommentListProps = {
  className?: string;
  profileAddress: Address;
};

export default function CommentList({
  className,
  profileAddress,
}: CommentListProps) {
  const { comments } = useProfileComments(profileAddress);

  return (
    <ul className={cn("space-y-3", className)}>
      {comments.length === 0 ? (
        // TODO: show empty state instead of text
        <p className="text-muted-foreground text-sm">No comments yet</p>
      ) : (
        comments.map((comment) => {
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
        })
      )}
    </ul>
  );
}

export function CommentListSkeleton() {
  // TODO: show skeleton instead of text
  return <p className="text-muted-foreground text-sm">Loading comments...</p>;
}

export function CommentListFallback() {
  // TODO: show fallback instead of text
  return (
    <p className="text-muted-foreground text-sm">Failed to load comments</p>
  );
}
