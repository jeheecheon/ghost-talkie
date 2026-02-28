import { isAddress } from "viem";
import usePrivateChatRoom from "@/hooks/usePrivateChatRoom";
import useSignChatProof from "@/hooks/useSignChatProof";
import type { Route } from "./+types/$address.chat";
import useWithWalletConnection from "@/hooks/useWithWalletConnection";

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!isAddress(params.address)) {
    throw new Response(null, {
      status: 400,
      statusText: "Invalid Wallet Address",
    });
  }

  return { address: params.address };
}

export default function ChatRoute({ loaderData }: Route.ComponentProps) {
  const { address: roomAddress } = loaderData;
  const { address: connectedAddress, withWalletConnection } =
    useWithWalletConnection();

  const {
    isError: isChatProofError,
    isPending: isChatProofPending,
    chatProof,
    signChatProof,
  } = useSignChatProof();

  const { roomState } = usePrivateChatRoom({
    chatProof,
    enabled: !!chatProof,
  });

  return (
    <div className="flex min-h-svh items-center justify-center">
      {!chatProof && (
        <button onClick={handleSignChatProof}>Sign Chat Proof</button>
      )}
      <p className="text-muted-foreground">
        {!connectedAddress && "Connect wallet to enter room"}
        {connectedAddress && isChatProofPending && "Signing..."}
        {connectedAddress && isChatProofError && "Signing failed"}
        {roomState && (
          <pre className="max-w-2xl overflow-auto">
            {JSON.stringify(roomState, null, 2)}
          </pre>
        )}
      </p>
    </div>
  );

  function handleSignChatProof() {
    withWalletConnection(async (address) => {
      signChatProof({ signerAddress: address, roomAddress });
    });
  }
}
