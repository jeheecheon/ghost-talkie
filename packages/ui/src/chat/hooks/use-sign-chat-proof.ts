import { useMutation } from "@tanstack/react-query";
import { useSignMessage } from "wagmi";
import type { Address } from "viem";
import { PeerRole, type ChatProof } from "@workspace/domain/p2p/types";
import {
  buildOwnerProofMessage,
  buildVisitorProofMessage,
} from "@workspace/domain/p2p/chat-proof";
import { determineChatRole } from "@workspace/domain/p2p/chat";

type SignChatProofArgs = {
  signerAddress: Address;
  roomAddress: Address;
};

export default function useSignChatProof() {
  const { mutateAsync: signMessage } = useSignMessage();

  const {
    status,
    isError,
    isPending,
    isSuccess,
    data: chatProof,
    mutate: signChatProof,
  } = useMutation({
    mutationFn: async ({
      signerAddress,
      roomAddress,
    }: SignChatProofArgs): Promise<ChatProof> => {
      const timestamp = Date.now();
      const role = determineChatRole({ signerAddress, roomAddress });
      const message =
        role === PeerRole.Owner
          ? buildOwnerProofMessage(roomAddress, timestamp)
          : buildVisitorProofMessage(signerAddress, roomAddress, timestamp);

      const signature = await signMessage({ message });
      return { signerAddress, roomAddress, timestamp, signature };
    },
  });

  return {
    status,
    isError,
    isPending,
    isSuccess,
    chatProof,
    signChatProof,
  };
}
