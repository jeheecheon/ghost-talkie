import useIdentity from "@/hooks/useIdentity";
import type { Route } from "./+types/$address.chat";
import { isAddress } from "viem";
import { shortenAddress } from "@/utils/address";

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
  const { address } = loaderData;

  const { isLoading } = useIdentity(address);

  return (
    <div className="flex min-h-svh items-center justify-center">
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <p className="text-muted-foreground">
          Chat with {shortenAddress(address)}
        </p>
      )}
    </div>
  );
}
