import { useEffect } from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { SimplePool } from "nostr-tools/pool";
import type { Address } from "viem";
import type { Comment } from "@workspace/domain/nostr/types";
import {
  buildCommentFilter,
  buildCommentTopicTag,
  mergeComments,
  resolveComment,
} from "@workspace/domain/nostr/comment";
import { safelyGetAsync } from "@workspace/lib/safely";
import { useNostrConfig } from "@workspace/ui/comment/context";

export const commentPool = new SimplePool();

export function buildCommentQueryKey(
  profileAddress: Address,
  topicPrefix: string,
) {
  return [
    "profile:comments",
    buildCommentTopicTag(profileAddress, topicPrefix),
  ];
}

export default function useProfileComments(profileAddress: Address) {
  const queryClient = useQueryClient();
  const { relays, topicPrefix } = useNostrConfig();
  const topicTag = buildCommentTopicTag(profileAddress, topicPrefix);

  const query = useSuspenseQuery({
    queryKey: buildCommentQueryKey(profileAddress, topicPrefix),
    queryFn: async () => {
      const events = await commentPool.querySync(
        relays,
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
      relays,
      buildCommentFilter(topicTag),
      {
        onevent: async (event) => {
          const comment = await safelyGetAsync(() => resolveComment(event));
          if (!comment) {
            return;
          }

          queryClient.setQueryData<Comment[]>(
            buildCommentQueryKey(profileAddress, topicPrefix),
            (prev) => mergeComments(prev ?? [], [comment]),
          );
        },
      },
    );

    return () => {
      sub.close();
    };
  }, [profileAddress, topicTag, queryClient, relays, topicPrefix]);

  return query;
}
