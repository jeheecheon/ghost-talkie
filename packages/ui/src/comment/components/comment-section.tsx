import { Suspense } from "react";
import type { Address } from "viem";
import ErrorBoundary from "@workspace/ui/primitives/error-boundary";
import CommentForm from "@workspace/ui/comment/components/comment-form";
import CommentList, {
  CommentListFallback,
  CommentListSkeleton,
} from "@workspace/ui/comment/components/comment-list";

type CommentSectionProps = {
  className?: string;
  address: Address;
};

export default function CommentSection({
  className,
  address,
}: CommentSectionProps) {
  return (
    <section className={className}>
      <h2 className="text-lg font-semibold">Comments</h2>

      <CommentForm className="mt-4" address={address} />

      <ErrorBoundary fallback={<CommentListFallback />}>
        <Suspense fallback={<CommentListSkeleton />}>
          <CommentList className="mt-4" address={address} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
