import { Suspense } from "react";
import type { Address } from "viem";
import CommentForm from "@/components/CommentForm";
import CommentList, {
  CommentListFallback,
  CommentListSkeleton,
} from "@/components/CommentList";
import ErrorBoundary from "@/components/ErrorBoundary";

type CommentSectionProps = {
  profileAddress: Address;
};

export default function CommentSection({
  profileAddress,
}: CommentSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Comments</h2>

      <CommentForm profileAddress={profileAddress} />

      <ErrorBoundary fallback={<CommentListFallback />}>
        <Suspense fallback={<CommentListSkeleton />}>
          <CommentList profileAddress={profileAddress} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
