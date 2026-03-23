import { debounce } from "lodash-es";
import type { SiteAdapter } from "@/lib/link-adapter";
import { INJECTED_ATTR } from "@/lib/link-adapter";
import { ENV } from "@/configs/env";
import { SITE_ADAPTERS, FALLBACK_ADAPTER } from "@/configs/injector-targets";
import { createGhostButton } from "@/lib/ghost-button";

const SCAN_DEBOUNCE_MS = 300;

function selectAdapter(url: string) {
  return SITE_ADAPTERS.find((a) => a.match(url)) ?? FALLBACK_ADAPTER;
}

function scanAndInject(adapter: SiteAdapter, root: Element) {
  const targets = adapter.findElements(root);

  for (const { element, address, position } of targets) {
    element.setAttribute(INJECTED_ATTR, "");

    const button = createGhostButton(address);
    const insertPosition = position === "after" ? "afterend" : "beforebegin";

    element.insertAdjacentElement(insertPosition, button);
  }
}

export default defineContentScript({
  matches: [...ENV.MARKETPLACE_MATCH_PATTERNS],
  runAt: "document_idle",
  main: () => {
    const adapter = selectAdapter(window.location.href);
    const root = adapter.getObserveRoot();

    scanAndInject(adapter, root);

    const debouncedScan = debounce(
      () => scanAndInject(adapter, root),
      SCAN_DEBOUNCE_MS,
    );

    const observer = new MutationObserver(debouncedScan);

    observer.observe(root, {
      childList: true,
      subtree: true,
    });
  },
});
