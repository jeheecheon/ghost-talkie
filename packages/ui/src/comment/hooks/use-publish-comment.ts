import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Address } from "viem";
import type { Comment, NostrIdentity } from "@workspace/domain/nostr/types";
import {
  buildCommentEvent,
  mergeComments,
  parseComment,
} from "@workspace/domain/nostr/comment";
import { assert, ensure } from "@workspace/lib/assert";
import {
  commentPool,
  buildCommentQueryKey,
} from "@workspace/ui/comment/hooks/use-profile-comments";
import { useNostrConfig } from "@workspace/ui/comment/context";

type PublishCommentPayload = {
  content: string;
  identity: NostrIdentity;
};

export default function usePublishComment(profileAddress: Address) {
  const queryClient = useQueryClient();
  const { relays, topicPrefix } = useNostrConfig();

  return useMutation({
    mutationFn: async ({ content, identity }: PublishCommentPayload) => {
      const event = buildCommentEvent(
        content,
        profileAddress,
        identity,
        topicPrefix,
      );
      const optimistic = {
        ...ensure(parseComment(event)),
        isVerified: true,
      };

      const results = await Promise.allSettled(
        commentPool.publish(relays, event),
      );

      const published = results.some((r) => r.status === "fulfilled");
      assert(published, "Failed to publish comment to any relay");

      queryClient.setQueryData<Comment[]>(
        buildCommentQueryKey(profileAddress, topicPrefix),
        (prev) => mergeComments(prev ?? [], [optimistic]),
      );
    },
  });
}
