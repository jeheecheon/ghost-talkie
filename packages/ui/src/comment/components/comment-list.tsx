import { isAddressEqual, type Address } from "viem";
import { shortenAddress } from "@workspace/lib/address";
import { formatRelativeTime } from "@workspace/lib/time";
import { cn } from "@workspace/lib/cn";
import useProfileComments from "@workspace/ui/comment/hooks/use-profile-comments";

type CommentListProps = {
  className?: string;
  address: Address;
};

export default function CommentList({ className, address }: CommentListProps) {
  const { data: comments } = useProfileComments(address);

  return (
    <ul className={cn("space-y-3", className)}>
      {comments.map((comment) => {
        const isOwner =
          isAddressEqual(comment.walletAddress, address) && comment.isVerified;

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
