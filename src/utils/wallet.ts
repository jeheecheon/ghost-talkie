import { type Address, verifyMessage } from "viem";
import type { ProfileComment } from "@/types/comment";

export function buildKeyMessage(address: Address): string {
  return [
    "GhostTalkie — Step 1 of 2",
    "",
    "Create your anonymous identity.",
    "This does NOT grant access to your funds.",
    "",
    `Wallet: ${address}`,
  ].join("\n");
}

export function buildProofMessage(
  address: Address,
  nostrPubkey: string,
): string {
  return [
    "GhostTalkie — Step 2 of 2",
    "",
    "Confirm ownership of your identity.",
    "This does NOT grant access to your funds.",
    "",
    `Wallet: ${address}`,
    `Ref: ${nostrPubkey}`,
  ].join("\n");
}

export async function verifyWalletProof(
  comment: ProfileComment,
): Promise<boolean> {
  const message = buildProofMessage(comment.walletAddress, comment.nostrPubkey);

  // TODO: standalone verifyMessage only handles EOA wallets.
  // Smart contract wallets (ERC-1271) require publicClient.verifyMessage().
  return verifyMessage({
    address: comment.walletAddress,
    message,
    signature: comment.proofSig,
  });
}
