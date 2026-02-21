import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Address } from "viem";
import type { Comment } from "@/types/comment";
import type { NostrIdentity } from "@/types/identity";
import {
  buildCommentEvent,
  mergeComments,
  parseComment,
} from "@/utils/comment";
import { env } from "@/configs/env";
import { assert, ensure } from "@/utils/assert";
import { commentPool, buildCommentQueryKey } from "@/hooks/useProfileComments";

type PublishCommentPayload = {
  content: string;
  identity: NostrIdentity;
};

export default function usePublishComment(profileAddress: Address) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, identity }: PublishCommentPayload) => {
      const event = buildCommentEvent(content, profileAddress, identity);
      const optimistic = {
        ...ensure(parseComment(event)),
        isVerified: true,
      };

      const results = await Promise.allSettled(
        commentPool.publish(env.nostrRelays, event),
      );

      const published = results.some((r) => r.status === "fulfilled");
      assert(published, "Failed to publish comment to any relay");

      queryClient.setQueryData<Comment[]>(
        buildCommentQueryKey(profileAddress),
        (prev) => mergeComments(prev ?? [], [optimistic]),
      );
    },
  });
}
