import { useSignMessage } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import {
  buildIdentityKeyMessage,
  buildIdentityProofMessage,
} from "@/utils/identity-proof";
import { deriveNostrIdentity } from "@/utils/nostr";
import useWithWalletConnection from "@/hooks/useWithWalletConnection";
import type { NostrIdentity } from "@/types/identity";

export default function useWithNostrIdentity() {
  const { mutateAsync: signMessage } = useSignMessage();
  const { withWalletConnection } = useWithWalletConnection();

  const {
    isError,
    isPending,
    isSuccess,
    mutateAsync: withNostrIdentity,
  } = useMutation({
    mutationFn: async (
      action: (nostrIdentity: NostrIdentity) => Promise<void>,
    ) => {
      await withWalletConnection(async (address) => {
        const keySig = await signMessage({
          message: buildIdentityKeyMessage(address),
        });
        const nostrIdentity = deriveNostrIdentity(address, keySig);
        const proofSig = await signMessage({
          message: buildIdentityProofMessage(address, nostrIdentity.publicKey),
        });
        await action({ ...nostrIdentity, proofSig });
      });
    },
  });

  return {
    isError,
    isPending,
    isSuccess,
    withNostrIdentity,
  };
}
