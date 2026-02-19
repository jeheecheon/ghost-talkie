import { useCallback } from "react";
import { useSignMessage } from "wagmi";
import type { Address } from "viem";
import { useIdentityStore } from "@/stores/identityStore";
import { buildKeyMessage, buildProofMessage } from "@/utils/wallet";
import { deriveNostrIdentity } from "@/utils/nostr";

export function useNostrIdentity() {
  const { mutateAsync: signMessage } = useSignMessage();

  const identity = useIdentityStore((s) => s.identity);
  const isPending = useIdentityStore((s) => s.isPending);

  const requestIdentity = useCallback(async (addr: Address) => {
    const { identity, isPending, setIdentity, setIsPending } =
      useIdentityStore.getState();

    if (identity || isPending) {
      return;
    }

    setIsPending(true);
    try {
      const keySig = await signMessage({ message: buildKeyMessage(addr) });
      const nostrIdentity = deriveNostrIdentity(addr, keySig);
      const proofSig = await signMessage({
        message: buildProofMessage(addr, nostrIdentity.publicKey),
      });

      setIdentity({ ...nostrIdentity, proofSig });
    } finally {
      setIsPending(false);
    }
  }, []);

  return { identity, isPending, requestIdentity };
}
