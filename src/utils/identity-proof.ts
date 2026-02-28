import { type Address, type Hex, verifyMessage } from "viem";

export function buildIdentityKeyMessage(address: Address): string {
  return [
    "GhostTalkie — Step 1 of 2",
    "",
    "Create your anonymous identity.",
    "This does NOT grant access to your funds.",
    "",
    `Wallet: ${address}`,
  ].join("\n");
}

export function buildIdentityProofMessage(
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

export async function verifyIdentityProof(
  address: Address,
  nostrPubkey: string,
  signature: Hex,
): Promise<boolean> {
  const message = buildIdentityProofMessage(address, nostrPubkey);

  // TODO: standalone verifyMessage only handles EOA wallets.
  // Smart contract wallets (ERC-1271) require publicClient.verifyMessage().
  return verifyMessage({ address, message, signature });
}
