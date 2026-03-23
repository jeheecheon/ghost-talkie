import { createLinkAdapter } from "@/lib/link-adapter";

export const SITE_ADAPTERS = [
  createLinkAdapter({
    urlPattern: /^https:\/\/(.*\.)?opensea\.io/,
    selector: "div:has(> span):has(> a[href*='0x'])",
    contentPattern: /owned by/i,
  }),
  createLinkAdapter({
    urlPattern: /^https:\/\/(.*\.)?blur\.io/,
    selector: 'div[role="table"]',
    contentPattern: /owner/i,
  }),
  createLinkAdapter({
    urlPattern: /^https:\/\/(.*\.)?crossnft\.io/,
    selector: "div:has(> small):has(> a)",
    contentPattern: /owned by/i,
  }),
];

export const FALLBACK_ADAPTER = createLinkAdapter({
  urlPattern: /.*/,
  getObserveRoot: () => document.body,
});
