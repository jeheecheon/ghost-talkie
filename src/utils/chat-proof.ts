import { verifyMessage, type Address } from "viem";
import type { ChatProof } from "@/types/chat";

const MAX_PROOF_AGE_MS = 5 * 60 * 1000;

function isProofFresh(timestamp: number): boolean {
  return Date.now() - timestamp <= MAX_PROOF_AGE_MS;
}

export function buildOwnerProofMessage(
  roomAddress: Address,
  timestamp: number,
): string {
  return [
    "GhostTalkie Chat Proof",
    "",
    "I am the owner of this room.",
    `Room: ${roomAddress}`,
    `Session: ${timestamp}`,
  ].join("\n");
}

export function buildVisitorProofMessage(
  visitorAddress: Address,
  roomAddress: Address,
  timestamp: number,
): string {
  return [
    "GhostTalkie Chat Proof",
    "",
    "I am visiting this room.",
    `Visitor: ${visitorAddress}`,
    `Room: ${roomAddress}`,
    `Session: ${timestamp}`,
  ].join("\n");
}

export async function verifyOwnerProof(proof: ChatProof): Promise<boolean> {
  if (
    proof.signerAddress !== proof.roomAddress ||
    !isProofFresh(proof.timestamp)
  ) {
    return false;
  }

  const message = buildOwnerProofMessage(proof.roomAddress, proof.timestamp);

  return verifyMessage({
    address: proof.signerAddress,
    message,
    signature: proof.signature,
  });
}

export async function verifyVisitorProof(proof: ChatProof): Promise<boolean> {
  if (!isProofFresh(proof.timestamp)) {
    return false;
  }

  const message = buildVisitorProofMessage(
    proof.signerAddress,
    proof.roomAddress,
    proof.timestamp,
  );

  return verifyMessage({
    address: proof.signerAddress,
    message,
    signature: proof.signature,
  });
}
