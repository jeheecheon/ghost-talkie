import { useParams } from "react-router";
import { isAddress } from "viem";
import { normalize } from "viem/ens";
import {
  useEnsAddress,
  useEnsName,
  useEnsAvatar,
  useConnection,
  useConnect,
  useConnectors,
} from "wagmi";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTrysteroRoom } from "@/hooks/useTrysteroRoom";
import { useState } from "react";

function WalletRoom() {
  const { addressOrEns } = useParams<{ addressOrEns: string }>();
  const { isConnected } = useConnection();
  const connectMutation = useConnect();
  const connectors = useConnectors();
  const [isChatting, setIsChatting] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  const isRawAddress = addressOrEns ? isAddress(addressOrEns) : false;
  const hasEnsFormat = addressOrEns?.includes(".");

  const { data: ensAddress, isLoading: isLoadingEnsAddress } = useEnsAddress({
    name: hasEnsFormat && addressOrEns ? normalize(addressOrEns) : undefined,
    query: { enabled: hasEnsFormat },
  });

  const resolvedAddress = isRawAddress ? addressOrEns : ensAddress;

  const { data: ensName, isLoading: isLoadingEnsName } = useEnsName({
    address: resolvedAddress as `0x${string}`,
    query: { enabled: !!resolvedAddress && isRawAddress },
  });

  const finalEnsName = hasEnsFormat ? addressOrEns : ensName;

  const { data: avatar, isLoading: isLoadingAvatar } = useEnsAvatar({
    name: finalEnsName ? normalize(finalEnsName) : undefined,
    query: { enabled: !!finalEnsName },
  });

  const roomId = resolvedAddress
    ? `inbox-${resolvedAddress.toLowerCase()}`
    : "";

  const {
    peers,
    messages,
    sendMessage,
    selfId,
    isConnected: hasPeer,
  } = useTrysteroRoom({
    roomId,
    enabled: isChatting && !!resolvedAddress,
  });

  const handleStartChat = () => {
    if (!isConnected) {
      connectMutation.mutate(
        { connector: connectors[0] },
        {
          onSuccess: () => {
            setIsChatting(true);
          },
        },
      );
    } else {
      setIsChatting(true);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput("");
    }
  };

  const isLoading = isLoadingEnsAddress || isLoadingEnsName || isLoadingAvatar;

  if (isLoading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!resolvedAddress) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
        <p className="text-destructive">Invalid address or ENS name</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <div className="flex flex-col items-center gap-4">
        {avatar ? (
          <img
            src={avatar}
            alt="ENS Avatar"
            className="h-24 w-24 rounded-full"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        {finalEnsName && (
          <p className="text-lg font-semibold">{finalEnsName}</p>
        )}

        <p className="text-muted-foreground text-sm">
          {resolvedAddress.slice(0, 6)}...{resolvedAddress.slice(-4)}
        </p>

        {!isChatting && (
          <Button
            onClick={handleStartChat}
            disabled={connectMutation.isPending}
          >
            {connectMutation.isPending
              ? "Connecting..."
              : isConnected
                ? "Start Chat"
                : "Connect Wallet & Start Chat"}
          </Button>
        )}
      </div>

      {isChatting && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-sm">
              {hasPeer
                ? `Connected to ${peers.length} peer${peers.length > 1 ? "s" : ""}`
                : "Waiting for peer..."}
            </p>

            <div className="mb-4 max-h-96 space-y-2 overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} className="rounded bg-muted p-2">
                  <p className="text-xs font-semibold">
                    {msg.sender === selfId
                      ? "You"
                      : `${msg.sender.slice(0, 6)}...${msg.sender.slice(-4)}`}
                  </p>
                  <p className="text-sm">{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 rounded border bg-background px-3 py-2 text-sm"
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletRoom;
