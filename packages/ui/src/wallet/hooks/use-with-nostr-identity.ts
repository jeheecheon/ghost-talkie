import { useSignMessage } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import {
  buildIdentityKeyMessage,
  buildIdentityProofMessage,
} from "@workspace/domain/nostr/identity-proof";
import { deriveNostrIdentity } from "@workspace/domain/nostr/identity";
import type { NostrIdentity } from "@workspace/domain/nostr/types";
import useWithWalletConnection from "@workspace/ui/wallet/hooks/use-with-wallet-connection";

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
