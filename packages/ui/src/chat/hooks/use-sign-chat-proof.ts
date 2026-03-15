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
  roomAddress: Address;
  signerAddress: Address;
};

export default function useSignChatProof() {
  const { mutateAsync: signMessage } = useSignMessage();

  const {
    isError,
    isPending,
    isSuccess,
    data: chatProof,
    mutateAsync: signChatProof,
  } = useMutation({
    mutationFn: async ({
      roomAddress,
      signerAddress,
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
    isError,
    isPending,
    isSuccess,
    chatProof,
    signChatProof,
  };
}
