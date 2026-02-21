import { useEffect } from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { SimplePool } from "nostr-tools/pool";
import type { Address } from "viem";
import type { Comment } from "@/types/comment";
import {
  buildCommentFilter,
  buildCommentTopicTag,
  mergeComments,
  resolveComment,
} from "@/utils/comment";
import { env } from "@/configs/env";
import { safelyGetAsync } from "@/utils/misc";

export const commentPool = new SimplePool();

export function buildCommentQueryKey(profileAddress: Address) {
  return ["profile:comments", buildCommentTopicTag(profileAddress)];
}

export default function useProfileComments(profileAddress: Address) {
  const queryClient = useQueryClient();
  const topicTag = buildCommentTopicTag(profileAddress);

  const { data: comments } = useSuspenseQuery({
    queryKey: buildCommentQueryKey(profileAddress),
    queryFn: async () => {
      const events = await commentPool.querySync(
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
    const sub = commentPool.subscribeMany(
      env.nostrRelays,
      buildCommentFilter(topicTag),
      {
        onevent: async (event) => {
          const comment = await safelyGetAsync(() => resolveComment(event));
          if (!comment) {
            return;
          }

          queryClient.setQueryData<Comment[]>(
            buildCommentQueryKey(profileAddress),
            (prev) => mergeComments(prev ?? [], [comment]),
          );
        },
      },
    );

    return () => {
      sub.close();
    };
  }, [profileAddress, topicTag, queryClient]);

  return { comments };
}
