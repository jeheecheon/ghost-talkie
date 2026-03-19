import { createPublicClient, http, type Address, type Hex } from "viem";
import { SUPPORTED_CHAINS } from "@workspace/domain/chains";
import type { ChatProof } from "@workspace/domain/p2p/types";

const chainClients = SUPPORTED_CHAINS.map((chain) =>
  createPublicClient({
    chain,
    transport: http(),
  }),
);

async function verifySignature(
  address: Address,
  message: string,
  signature: Hex,
): Promise<boolean> {
  try {
    await Promise.any(
      chainClients.map(async (client) => {
        const valid = await client.verifyMessage({
          address,
          message,
          signature,
        });
        if (!valid) {
          throw new Error("invalid");
        }
      }),
    );

    return true;
  } catch {
    return false;
  }
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
  if (proof.signerAddress !== proof.roomAddress) {
    return false;
  }

  const message = buildOwnerProofMessage(proof.roomAddress, proof.timestamp);

  return verifySignature(proof.signerAddress, message, proof.signature);
}

export async function verifyVisitorProof(proof: ChatProof): Promise<boolean> {
  const message = buildVisitorProofMessage(
    proof.signerAddress,
    proof.roomAddress,
    proof.timestamp,
  );

  return verifySignature(proof.signerAddress, message, proof.signature);
}
