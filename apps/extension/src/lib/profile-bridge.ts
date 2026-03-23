import type { Nullable } from "@workspace/types/misc";
import { type Address, isAddress } from "viem";
import { safelyRunAsync, safelyGetAsync } from "@workspace/lib/safely";

export enum ProfileMessage {
  Open = "OPEN_PROFILE",
  Navigate = "NAVIGATE_TO_PROFILE",
  GetPending = "GET_PENDING_PROFILE",
}

export function initProfileHandler() {
  let pendingAddress: Nullable<string> = null;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === ProfileMessage.GetPending) {
      sendResponse({ address: pendingAddress });
      pendingAddress = null;
      return;
    }

    if (message.type !== ProfileMessage.Open || !sender.tab?.id) {
      return;
    }

    pendingAddress = message.address;
    chrome.sidePanel.open({ tabId: sender.tab.id });

    void safelyRunAsync(() =>
      chrome.runtime.sendMessage({
        type: ProfileMessage.Navigate,
        address: message.address,
      }),
    );
  });
}

export function initProfileBridge(onNavigate: (address: Address) => void) {
  void requestPendingProfile(onNavigate);

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type !== ProfileMessage.Navigate) {
      return;
    }
    if (typeof message.address !== "string" || !isAddress(message.address)) {
      return;
    }

    onNavigate(message.address);
  });
}

async function requestPendingProfile(onNavigate: (address: Address) => void) {
  const response = await safelyGetAsync(() =>
    chrome.runtime.sendMessage({ type: ProfileMessage.GetPending }),
  );
  if (typeof response?.address !== "string" || !isAddress(response.address)) {
    return;
  }

  onNavigate(response.address);
}
