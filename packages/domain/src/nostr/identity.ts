import { sha256 } from "@noble/hashes/sha2.js";
import { getPublicKey } from "nostr-tools/pure";
import { hexToBytes, type Address, type Hex } from "viem";
import type { DerivedIdentity } from "@workspace/domain/nostr/types";

export function deriveNostrIdentity(
  walletAddress: Address,
  keySig: Hex,
): DerivedIdentity {
  const sigBytes = hexToBytes(keySig);
  const privateKey = sha256(sigBytes);
  const publicKey = getPublicKey(privateKey);

  return { privateKey, publicKey, walletAddress };
}
