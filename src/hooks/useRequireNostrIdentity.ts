import { useSignMessage } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import { buildKeyMessage, buildProofMessage } from "@/utils/wallet";
import { deriveNostrIdentity } from "@/utils/nostr";
import useRequireWallet from "@/hooks/useRequireWallet";
import type { NostrIdentity } from "@/types/identity";

export default function useRequireNostrIdentity() {
  const { mutateAsync: signMessage } = useSignMessage();
  const { mutateAsync: requireWallet } = useRequireWallet();

  return useMutation({
    mutationFn: async (
      action: (nostrIdentity: NostrIdentity) => Promise<void>,
    ) => {
      await requireWallet(async (address) => {
        const keySig = await signMessage({ message: buildKeyMessage(address) });
        const nostrIdentity = deriveNostrIdentity(address, keySig);
        const proofSig = await signMessage({
          message: buildProofMessage(address, nostrIdentity.publicKey),
        });
        await action({ ...nostrIdentity, proofSig });
      });
    },
  });
}
