import { finalizeEvent, verifyEvent } from "nostr-tools/pure";
import type { Event, EventTemplate, VerifiedEvent } from "nostr-tools/core";
import type { Filter } from "nostr-tools/filter";
import { isAddress, isHex, type Address } from "viem";
import { A_SECOND } from "@/constants/misc";
import type { Nullable } from "@/types/misc";
import type { Comment } from "@/types/comment";
import type { NostrIdentity } from "@/types/identity";
import { env } from "@/configs/env";
import { verifyWalletProof } from "@/utils/wallet";

export const NOSTR_KIND_TEXT_NOTE = 1;

const WALLET_TAG = "w";
const WALLET_SIG_TAG = "ws";

export function buildCommentTopicTag(address: Address): string {
  return `${env.nostrTopicPrefix}:${address.toLowerCase()}`;
}

export function buildCommentEvent(
  content: string,
  profileAddress: Address,
  identity: NostrIdentity,
): VerifiedEvent {
  const template: EventTemplate = {
    kind: NOSTR_KIND_TEXT_NOTE,
    content,
    created_at: Math.floor(Date.now() / A_SECOND),
    tags: [
      ["t", buildCommentTopicTag(profileAddress)],
      [WALLET_TAG, identity.walletAddress],
      [WALLET_SIG_TAG, identity.proofSig],
    ],
  };

  return finalizeEvent(template, identity.privateKey);
}

export function parseComment(event: Event): Nullable<Comment> {
  const walletTag = event.tags.find((t) => t[0] === WALLET_TAG);
  const walletSigTag = event.tags.find((t) => t[0] === WALLET_SIG_TAG);

  const walletAddress = walletTag?.[1];
  const proofSig = walletSigTag?.[1];

  if (
    !walletAddress ||
    !proofSig ||
    !isAddress(walletAddress) ||
    !isHex(proofSig)
  ) {
    return null;
  }

  return {
    id: event.id,
    content: event.content,
    nostrPubkey: event.pubkey,
    walletAddress,
    proofSig,
    createdAt: event.created_at,
    isVerified: false,
  };
}

export function buildCommentFilter(topicTag: string): Filter {
  return { kinds: [NOSTR_KIND_TEXT_NOTE], "#t": [topicTag], limit: 50 };
}

export function mergeComments(
  existing: Comment[],
  incoming: Comment[],
): Comment[] {
  const knownIds = new Set(existing.map((c) => c.id));
  const novel = incoming.filter((c) => !knownIds.has(c.id));

  if (novel.length === 0) {
    return existing;
  }

  return [...existing, ...novel].sort((a, b) => b.createdAt - a.createdAt);
}

export async function resolveComment(event: Event): Promise<Nullable<Comment>> {
  if (!verifyEvent(event)) {
    return null;
  }

  const comment = parseComment(event);
  if (!comment) {
    return null;
  }

  return { ...comment, isVerified: await verifyWalletProof(comment) };
}
