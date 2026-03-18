import { isAddressEqual, type Address } from "viem";
import { AlertCircle, MessageCircleOff } from "lucide-react";
import type { Comment } from "@workspace/domain/nostr/types";
import { shortenAddress } from "@workspace/lib/address";
import { formatRelativeTime } from "@workspace/lib/time";
import { cn } from "@workspace/lib/cn";
import { Skeleton } from "@workspace/ui/primitives/skeleton";
import { Button } from "@workspace/ui/primitives/button";

type CommentListProps = {
  className?: string;
  profileAddress: Address;
  comments: Comment[];
};

export default function CommentList({
  className,
  profileAddress,
  comments,
}: CommentListProps) {
  return (
    <div className={cn(className)}>
      {comments.length === 0 ? (
        <CommentListEmpty />
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
    </div>
  );
}

const SKELETON_COUNT = 5;

type CommentListSkeletonProps = {
  className?: string;
};

export function CommentListSkeleton({ className }: CommentListSkeletonProps) {
  return (
    <ul className={cn("space-y-3", className)}>
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <li key={i}>
          <div className="bg-muted space-y-1 rounded-lg p-3">
            <div className="flex items-center gap-x-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>

            <Skeleton className="h-4 w-full" />
          </div>
        </li>
      ))}
    </ul>
  );
}

type CommentListFallbackProps = {
  className?: string;
};

export function CommentListFallback({ className }: CommentListFallbackProps) {
  return (
    <div
      className={cn(
        "bg-destructive/10 flex flex-col items-center gap-y-2 rounded-lg p-6",
        className,
      )}
    >
      <AlertCircle className="text-destructive size-6" />
      <p className="text-destructive text-sm font-medium">
        Failed to load comments
      </p>
      <Button variant="outline" size="sm" onClick={handleRetry}>
        Retry
      </Button>
    </div>
  );

  function handleRetry() {
    window.location.reload();
  }
}

type CommentListEmptyProps = {
  className?: string;
};

export function CommentListEmpty({ className }: CommentListEmptyProps) {
  return (
    <button
      className={cn(
        "bg-muted group *:group-hover:text-foreground flex w-full flex-col items-center gap-y-1 rounded-lg p-6 *:transition-colors",
        className,
      )}
      type="button"
      onClick={handleClick}
    >
      <MessageCircleOff className="text-muted-foreground size-6" />
      <p className="text-muted-foreground text-sm">No comments yet</p>
      <p className="text-muted-foreground text-xs">Be the first to comment</p>
    </button>
  );

  function handleClick() {
    document.getElementById("comment-textarea")?.focus();
  }
}
