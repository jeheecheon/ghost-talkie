import type { Nullable } from "@workspace/types/misc";
import type {
  EIP6963AnnounceProviderEvent,
  EIP6963ProviderDetail,
  EIP6963ProviderInfo,
} from "mipd";
import { sleep } from "@workspace/lib/misc";
import { BridgeMessage } from "@/lib/wallet-provider-proxy";

const PROVIDER_DISCOVERY_TIMEOUT_MS = 300;

export default defineContentScript({
  matches: ["https://*/*"],
  world: "MAIN",
  runAt: "document_start",
  main: () => {
    const providers = new Map<string, EIP6963ProviderDetail>();
    let selectedRdns: Nullable<string> = null;
    let unsubscribeEvents: Nullable<() => void> = null;

    window.addEventListener("eip6963:announceProvider", ((
      event: EIP6963AnnounceProviderEvent,
    ) => {
      const detail = event.detail;
      providers.set(detail.info.rdns, detail);
    }) as EventListener);

    function isErrorWithCode(
      error: unknown,
    ): error is Error & { code: number } {
      return (
        error instanceof Error &&
        "code" in error &&
        typeof error.code === "number"
      );
    }

    function resolveProvider(): Nullable<EIP6963ProviderDetail["provider"]> {
      if (!selectedRdns) {
        return null;
      }

      return providers.get(selectedRdns)?.provider ?? null;
    }

    function subscribeProviderEvents(
      provider: EIP6963ProviderDetail["provider"],
    ) {
      if (unsubscribeEvents) {
        unsubscribeEvents();
        unsubscribeEvents = null;
      }

      if (!provider.on) {
        return;
      }

      const handleAccountsChanged = (...args: unknown[]) => {
        window.postMessage(
          {
            type: BridgeMessage.EthereumEvent,
            event: "accountsChanged",
            data: args[0],
          },
          "*",
        );
      };

      const handleChainChanged = (...args: unknown[]) => {
        window.postMessage(
          {
            type: BridgeMessage.EthereumEvent,
            event: "chainChanged",
            data: args[0],
          },
          "*",
        );
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);

      unsubscribeEvents = () => {
        provider.removeListener("accountsChanged", handleAccountsChanged);
        provider.removeListener("chainChanged", handleChainChanged);
      };
    }

    function detectNonEip6963Providers() {
      const crossWallet = (window as any).crossWallet;

      if (crossWallet?.request && !providers.has("io.nicegram.crossx")) {
        providers.set("io.nicegram.crossx", {
          info: {
            uuid: "crossx",
            name: "CROSSx",
            icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSI+PGNpcmNsZSBjeD0iMTQiIGN5PSIxNCIgcj0iMTQiIGZpbGw9InVybCgjZykiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE0LjUgMkwxNi44ODE3IDQuMzgxNjhWOC4yODA4OUwxOS45NTY1IDUuMjA2MTFMMjMuMzI0NyA4LjU3NDMxTDIwLjI4MDcgMTEuNjE4M0gxNC41QzEzLjE4NDYgMTEuNjE4MyAxMi4xMTgzIDEyLjY4NDYgMTIuMTE4MyAxNEMxMi4xMTgzIDE1LjMxNTQgMTMuMTg0NiAxNi4zODE3IDE0LjUgMTYuMzgxN0gyMC4yNTAyTDIzLjMyNDggMTkuNDU2MkwxOS45NTY2IDIyLjgyNDRMMTYuODgxNyAxOS43NDk1VjIzLjYxODNMMTQuNSAyNkwxMi4xMTgzIDIzLjYxODNWMTkuNzgwN0w5LjA3NDU4IDIyLjgyNDRMNS43MDYzNyAxOS40NTYyTDguNzgwODkgMTYuMzgxN0g0Ljg4MTY4TDIuNSAxNEw0Ljg4MTY4IDExLjYxODNIOC43NTA0N0w1LjcwNjQ2IDguNTc0MzFMOS4wNzQ2NyA1LjIwNjExTDEyLjExODMgOC4yNDk3NlY0LjM4MTY4TDE0LjUgMloiIGZpbGw9ImJsYWNrIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMC4wMjc2ODI4IiB5MT0iMTQiIHgyPSIxNS45MDAyIiB5Mj0iMjkuMTI3NSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMC4yIiBzdG9wLWNvbG9yPSIjMjBFMkJCIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDBBRDhBIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+",
            rdns: "io.nicegram.crossx",
          },
          provider: crossWallet,
        });
      }
    }

    async function handleDiscoveryRequest() {
      window.dispatchEvent(new Event("eip6963:requestProvider"));
      await sleep(PROVIDER_DISCOVERY_TIMEOUT_MS);
      detectNonEip6963Providers();

      const wallets: EIP6963ProviderInfo[] = Array.from(providers.values()).map(
        (detail) => detail.info,
      );

      window.postMessage(
        { type: BridgeMessage.WalletDiscoveryResult, wallets },
        "*",
      );
    }

    function handleWalletSelect(rdns: string) {
      selectedRdns = rdns;
      const provider = resolveProvider();

      if (provider) {
        subscribeProviderEvents(provider);
      }

      window.postMessage(
        { type: BridgeMessage.WalletSelectResult, success: !!provider },
        "*",
      );
    }

    async function handleEthereumRequest(
      id: number,
      method: string,
      params: unknown[],
    ) {
      const provider = resolveProvider();

      if (!provider) {
        window.postMessage(
          {
            type: BridgeMessage.EthereumResponse,
            id,
            error: { message: "No wallet selected", code: 4200 },
          },
          "*",
        );
        return;
      }

      try {
        const result = await provider.request({ method, params } as any);
        window.postMessage(
          { type: BridgeMessage.EthereumResponse, id, result },
          "*",
        );
      } catch (error: unknown) {
        window.postMessage(
          {
            type: BridgeMessage.EthereumResponse,
            id,
            error: isErrorWithCode(error)
              ? { message: error.message, code: error.code }
              : {
                  message:
                    error instanceof Error ? error.message : "Unknown error",
                },
          },
          "*",
        );
      }
    }

    window.addEventListener("message", (event) => {
      if (event.source !== window) {
        return;
      }

      const { data } = event;

      if (data?.type === BridgeMessage.WalletDiscoveryRequest) {
        void handleDiscoveryRequest();
        return;
      }

      if (data?.type === BridgeMessage.WalletSelect) {
        handleWalletSelect(data.rdns);
        return;
      }

      if (data?.type === BridgeMessage.EthereumRequest) {
        void handleEthereumRequest(data.id, data.method, data.params);
      }
    });
  },
});
