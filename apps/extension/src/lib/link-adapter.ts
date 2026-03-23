import type { Nullable } from "@workspace/types/misc";

export const INJECTED_ATTR = "data-ghost-injected";

export type AddressTarget = {
  element: Element;
  address: string;
  position: "before" | "after";
};

export type SiteAdapter = {
  match(url: string): boolean;
  findElements(root: Element): AddressTarget[];
  getObserveRoot(): Element;
};

type CreateLinkAdapterArgs = {
  urlPattern: RegExp;
  contentPattern?: RegExp;
  selector?: string;
  getObserveRoot?: () => Element;
};

export function createLinkAdapter({
  urlPattern,
  contentPattern,
  selector = 'a[href*="/0x"]',
  getObserveRoot = () => document.getElementById("__next") ?? document.body,
}: CreateLinkAdapterArgs): SiteAdapter {
  return {
    match: (url) => urlPattern.test(url),
    findElements: (root) => {
      const targets: AddressTarget[] = [];
      const elements = root.querySelectorAll(selector);

      for (const element of elements) {
        if (element.hasAttribute(INJECTED_ATTR)) {
          continue;
        }

        if (contentPattern && !contentPattern.test(element.textContent ?? "")) {
          continue;
        }

        const address = _extractAddress(element);
        if (!address) {
          continue;
        }

        targets.push({ element, address, position: "after" });
      }

      return targets;
    },
    getObserveRoot,
  };
}

function _extractAddress(el: Element): Nullable<string> {
  const ETH_ADDRESS_REGEX = /(0x[a-fA-F0-9]{40})/i;

  const href = el.parentNode
    ?.querySelector<HTMLAnchorElement>("a[href*='0x']")
    ?.getAttribute("href");

  if (href) {
    const match = href.match(ETH_ADDRESS_REGEX);

    if (match) {
      return match[1].toLowerCase();
    }
  }

  const textMatch = el.textContent?.match(ETH_ADDRESS_REGEX);
  return textMatch?.[1]?.toLowerCase() ?? null;
}
