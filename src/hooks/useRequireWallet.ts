import { useConnection, useConnect, useConnectors } from "wagmi";

export function useRequireWallet() {
  const { isConnected, isConnecting, isReconnecting } = useConnection();
  const connectMutation = useConnect();
  const connectors = useConnectors();

  return {
    isConnected,
    isLoading: isConnecting || isReconnecting,
    execute(action: () => void) {
      if (!isConnected) {
        connectMutation.mutate(
          { connector: connectors[0] },
          { onSuccess: action },
        );
        return;
      }

      action();
    },
  };
}
