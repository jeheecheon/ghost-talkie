import { useCallback } from "react";
import { useSignMessage } from "wagmi";
import type { Address } from "viem";
import { useIdentityStore } from "@/stores/identityStore";
import { deriveIdentity } from "@/utils/nostr";
import { buildKeyMessage, buildProofMessage } from "@/utils/wallet";

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
      const derived = deriveIdentity(addr, keySig);
      const proofSig = await signMessage({
        message: buildProofMessage(addr, derived.publicKey),
      });

      setIdentity({ ...derived, proofSig });
    } finally {
      setIsPending(false);
    }
  }, []);

  return { identity, isPending, requestIdentity };
}
