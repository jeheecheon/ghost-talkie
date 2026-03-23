import type { Nullable } from "@workspace/types/misc";
import type { EIP6963ProviderInfo } from "mipd";
import { assert } from "@workspace/lib/assert";

export enum BridgeMessage {
  // Sidepanel → Content script
  EthereumRequest = "ETHEREUM_REQUEST",
  WalletDiscoveryRequest = "WALLET_DISCOVERY_REQUEST",
  WalletSelect = "WALLET_SELECT",

  // Content script → Sidepanel
  EthereumResponse = "ETHEREUM_RESPONSE",
  WalletDiscoveryResult = "WALLET_DISCOVERY_RESULT",
  WalletSelectResult = "WALLET_SELECT_RESULT",
  EthereumEvent = "ETHEREUM_EVENT",

  // Background → Sidepanel
  TabActivated = "TAB_ACTIVATED",
}

type ProxyEventHandler = (...args: unknown[]) => void;

type RpcResponse = {
  result?: unknown;
  error?: { message: string; code: number };
};

type DiscoveryResponse = {
  wallets?: EIP6963ProviderInfo[];
};

type SelectResponse = {
  success?: boolean;
};

class RpcError extends Error {
  constructor(
    message: string,
    public code: number,
  ) {
    super(message);
  }
}

export class WalletProviderProxy {
  private _listeners = new Map<string, Set<ProxyEventHandler>>();
  private _requestId = 0;
  private _selectedRdns: Nullable<string> = null;

  constructor() {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === BridgeMessage.EthereumEvent) {
        this._emit(message.event, message.data);
      }

      if (message.type === BridgeMessage.TabActivated) {
        void this.resync();
      }
    });
  }

  public async request({
    method,
    params,
  }: {
    method: string;
    params?: unknown[];
  }): Promise<unknown> {
    const tabId = await this._queryActiveTabId();
    assert(tabId, "No active tab. Navigate to a website first.");

    const response: RpcResponse = await chrome.tabs.sendMessage(tabId, {
      type: BridgeMessage.EthereumRequest,
      id: ++this._requestId,
      method,
      params,
    });
    if (response?.error) {
      throw new RpcError(response.error.message, response.error.code);
    }

    return response?.result;
  }

  public on(event: string, handler: ProxyEventHandler) {
    let handlers = this._listeners.get(event);
    if (!handlers) {
      handlers = new Set();
      this._listeners.set(event, handlers);
    }

    handlers.add(handler);
  }

  public removeListener(event: string, handler: ProxyEventHandler) {
    this._listeners.get(event)?.delete(handler);
  }

  public async discover(): Promise<EIP6963ProviderInfo[]> {
    const tabId = await this._queryActiveTabId();
    if (tabId === null) {
      return [];
    }

    try {
      const response: DiscoveryResponse = await chrome.tabs.sendMessage(tabId, {
        type: BridgeMessage.WalletDiscoveryRequest,
      });

      return response?.wallets ?? [];
    } catch {
      return [];
    }
  }

  public async select(rdns: string): Promise<boolean> {
    const tabId = await this._queryActiveTabId();
    if (tabId === null) {
      return false;
    }

    try {
      const response: SelectResponse = await chrome.tabs.sendMessage(tabId, {
        type: BridgeMessage.WalletSelect,
        rdns,
      });
      if (response?.success) {
        this._selectedRdns = rdns;
      }

      return !!response?.success;
    } catch {
      return false;
    }
  }

  public async resync(): Promise<void> {
    if (!this._selectedRdns) {
      return;
    }

    await this.select(this._selectedRdns);
  }

  private _emit(event: string, ...args: unknown[]) {
    this._listeners.get(event)?.forEach((handler) => handler(...args));
  }

  private async _queryActiveTabId(): Promise<Nullable<number>> {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    return tab?.id ?? null;
  }
}
