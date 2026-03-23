import { BridgeMessage } from "@/lib/wallet-provider-proxy";

function relayToMainWorld(
  message: unknown,
  responseType: string,
  sendResponse: (response: unknown) => void,
  matchResponse?: (data: Record<string, unknown>) => boolean,
) {
  const handleResponse = (event: MessageEvent) => {
    if (event.source !== window || event.data?.type !== responseType) {
      return;
    }

    if (matchResponse && !matchResponse(event.data)) {
      return;
    }

    window.removeEventListener("message", handleResponse);
    sendResponse(event.data);
  };

  window.addEventListener("message", handleResponse);
  window.postMessage(message, "*");
}

export default defineContentScript({
  matches: ["https://*/*"],
  runAt: "document_start",
  main: () => {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === BridgeMessage.WalletDiscoveryRequest) {
        relayToMainWorld(
          message,
          BridgeMessage.WalletDiscoveryResult,
          sendResponse,
        );
        return true;
      }

      if (message.type === BridgeMessage.WalletSelect) {
        relayToMainWorld(
          message,
          BridgeMessage.WalletSelectResult,
          sendResponse,
        );
        return true;
      }

      if (message.type === BridgeMessage.EthereumRequest) {
        relayToMainWorld(
          message,
          BridgeMessage.EthereumResponse,
          sendResponse,
          (data) => data.id === message.id,
        );
        return true;
      }

      return false;
    });

    window.addEventListener("message", (event) => {
      if (
        event.source !== window ||
        event.data?.type !== BridgeMessage.EthereumEvent
      ) {
        return;
      }

      chrome.runtime.sendMessage(event.data);
    });
  },
});
