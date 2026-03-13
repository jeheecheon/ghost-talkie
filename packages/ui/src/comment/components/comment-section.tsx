import { Suspense } from "react";
import type { Address } from "viem";
import ErrorBoundary from "@workspace/ui/primitives/error-boundary";
import CommentForm from "@workspace/ui/comment/components/comment-form";
import CommentList, {
  CommentListFallback,
  CommentListSkeleton,
} from "./comment-list";

type CommentSectionProps = {
  className?: string;
  profileAddress: Address;
};

export default function CommentSection({
  className,
  profileAddress,
}: CommentSectionProps) {
  return (
    <section className={className}>
      <h2 className="text-lg font-semibold">Comments</h2>

      <CommentForm className="mt-4" profileAddress={profileAddress} />

      <ErrorBoundary fallback={<CommentListFallback />}>
        <Suspense fallback={<CommentListSkeleton />}>
          <CommentList className="mt-4" profileAddress={profileAddress} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
