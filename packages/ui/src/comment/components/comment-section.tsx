import { Suspense } from "react";
import type { Address } from "viem";
import ErrorBoundary from "@workspace/ui/primitives/error-boundary";
import CommentForm from "@workspace/ui/comment/components/comment-form";
import CommentList, {
  CommentListFallback,
  CommentListSkeleton,
} from "@workspace/ui/comment/components/comment-list";
import { cn } from "@workspace/lib/cn";

type CommentSectionProps = {
  className?: string;
  address: Address;
};

export default function CommentSection({
  className,
  address,
}: CommentSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-lg font-semibold">Comments</h2>

      <CommentForm address={address} />

      <ErrorBoundary fallback={<CommentListFallback />}>
        <Suspense fallback={<CommentListSkeleton />}>
          <CommentList address={address} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
