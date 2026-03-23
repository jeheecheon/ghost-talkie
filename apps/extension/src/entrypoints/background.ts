import { BridgeMessage } from "@/lib/wallet-provider-proxy";
import { initProfileHandler } from "@/lib/profile-bridge";

export default defineBackground(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.runtime.sendMessage({
      type: BridgeMessage.TabActivated,
      tabId: activeInfo.tabId,
    });
  });

  initProfileHandler();
});
