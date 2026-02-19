import { useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SimplePool } from "nostr-tools/pool";
import type { Address } from "viem";
import type { Comment } from "@/types/comment";
import type { NostrIdentity } from "@/types/identity";
import {
  buildCommentEvent,
  buildCommentFilter,
  buildCommentTopicTag,
  mergeComments,
  parseComment,
  resolveComment,
} from "@/utils/comment";
import { env } from "@/configs/env";
import { assert, ensure } from "@/utils/assert";
import { safelyGetAsync } from "@/utils/misc";

const pool = new SimplePool();

function buildQueryKey(profileAddress: Address) {
  return ["profile:comments", buildCommentTopicTag(profileAddress)];
}

export function useProfileComments(profileAddress: Address) {
  const queryClient = useQueryClient();
  const topicTag = buildCommentTopicTag(profileAddress);

  const { data: comments = [], isLoading } = useQuery({
    queryKey: buildQueryKey(profileAddress),
    queryFn: async () => {
      const events = await pool.querySync(
        env.nostrRelays,
        buildCommentFilter(topicTag),
      );

      const comments = (
        await Promise.all(
          events.map((e) => safelyGetAsync(() => resolveComment(e))),
        )
      ).filter((c): c is Comment => !!c);

      return comments;
    },
  });

  useEffect(() => {
    const sub = pool.subscribeMany(
      env.nostrRelays,
      buildCommentFilter(topicTag),
      {
        onevent: async (event) => {
          const comment = await safelyGetAsync(() => resolveComment(event));
          if (!comment) {
            return;
          }

          queryClient.setQueryData<Comment[]>(
            buildQueryKey(profileAddress),
            (prev) => mergeComments(prev ?? [], [comment]),
          );
        },
      },
    );

    return () => {
      sub.close();
    };
  }, [profileAddress, topicTag, queryClient]);

  const publishComment = useCallback(
    async (content: string, identity: NostrIdentity): Promise<void> => {
      const event = buildCommentEvent(content, profileAddress, identity);
      const optimistic = {
        ...ensure(parseComment(event)),
        isVerified: true,
      };

      const results = await Promise.allSettled(
        pool.publish(env.nostrRelays, event),
      );

      const published = results.some((r) => r.status === "fulfilled");
      assert(published, "Failed to publish comment to any relay");

      queryClient.setQueryData<Comment[]>(
        buildQueryKey(profileAddress),
        (prev) => mergeComments(prev ?? [], [optimistic]),
      );
    },
    [profileAddress, queryClient],
  );

  return { comments, isLoading, publishComment };
}
