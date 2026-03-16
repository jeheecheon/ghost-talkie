# Chrome Extension Framework Selection

**Date:** 2026-03-12
**Context:** Selecting a framework for `apps/extension` in a Turborepo monorepo
**Existing Stack:** `apps/web` — Vite + React 19 + React Router + Tailwind CSS v4 + shadcn/ui

---

## Executive Summary

Three candidates evaluated: **WXT**, **Plasmo**, and **CRXJS Vite Plugin**. WXT is the clear winner for this project due to Vite alignment, active maintenance, and built-in Shadow DOM isolation for content scripts.

**TL;DR:** WXT — same Vite base as the web app, monorepo-native, actively maintained.

---

## 1. Project Requirements

Before evaluating frameworks, define what `apps/extension` must do.

### 1.1 Hard Requirements

| Requirement | Reason |
| --- | --- |
| **Content script with React UI** | Inject "Chat" button next to wallet addresses on OpenSea, Blur, etc. |
| **Shadow DOM isolation** | Injected UI must not be affected by host page CSS |
| **Side panel** | Chat UI opens in side panel alongside the marketplace |
| **Background service worker** | Message bridge between content script and side panel |
| **Manifest V3** | Chrome enforces MV3 for new extensions |
| **Vite-compatible** | `apps/web` uses Vite; shared `packages/*` must resolve identically |

### 1.2 Soft Requirements

| Requirement | Reason |
| --- | --- |
| HMR during development | Fast iteration on content script UI |
| Multi-browser support | Firefox/Edge as future consideration |
| TypeScript first-class | Project is fully TypeScript |
| Tailwind CSS support | Shared design system with `apps/web` |

---

## 2. Candidates

### 2.1 WXT (Web Extension Toolkit)

**What it is:** Vite-native framework with file-based entrypoints and built-in extension APIs.

```
entrypoints/
├── background.ts            # Service worker
├── content.tsx              # Content script
├── popup/index.html         # Popup page
└── sidepanel.html           # Side panel
```

Content script with Shadow DOM isolation:

```tsx
export default defineContentScript({
  matches: ['https://opensea.io/*', 'https://blur.io/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'ghosttalkie-button',
      position: 'inline',
      anchor: '[data-wallet-address]',
      onMount: (container) => {
        const app = document.createElement('div');
        container.append(app);
        const root = ReactDOM.createRoot(app);
        root.render(<ChatButton />);
        return root;
      },
      onRemove: (root) => root?.unmount(),
    });
    ui.mount();
  },
});
```

| Attribute | Detail |
| --- | --- |
| Bundler | Vite |
| React | Supported (Shadow Root UI / Integrated UI) |
| Side Panel | Declarative HTML entrypoint |
| Monorepo | `srcDir` config + TS reference paths |
| MV3 | Yes |
| HMR | Yes |
| Browsers | Chrome, Firefox, Edge, Safari |
| GitHub Stars | ~5.5k |
| Maintenance | Active (frequent releases, 2026 current) |

### 2.2 Plasmo

**What it is:** Parcel-based extension framework with the simplest content script DX.

```tsx
// content.tsx — entire file
export default function GhostTalkieButton() {
  return <button>Chat</button>;
}
```

Zero boilerplate — export a React component, Plasmo auto-injects it.

| Attribute | Detail |
| --- | --- |
| Bundler | **Parcel** (not Vite) |
| React | First-class (auto-mount via default export) |
| Side Panel | Supported |
| Monorepo | Limited (Parcel config differs from Vite) |
| MV3 | Yes |
| HMR | Yes |
| Browsers | Chrome, Firefox, Edge |
| GitHub Stars | ~11k |
| Maintenance | Active |

### 2.3 CRXJS Vite Plugin

**What it is:** A Vite plugin — not a framework. Adds Chrome extension build support to any Vite project.

```js
// vite.config.ts — just add the plugin
export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
```

| Attribute | Detail |
| --- | --- |
| Bundler | Vite (plugin) |
| React | Supported |
| Side Panel | Manual (declare in manifest.json) |
| Monorepo | Works (standard Vite project) |
| MV3 | Yes (some community-reported issues) |
| HMR | Yes |
| Browsers | Chrome only |
| GitHub Stars | ~2.6k |
| Maintenance | **Stale** (last major release ~2023) |

---

## 3. Evaluation

### 3.1 Round 1: Bundler Alignment

The most impactful criterion. A bundler mismatch propagates into every shared surface.

| Surface | Vite (`apps/web`) | Parcel (Plasmo) | Impact |
| --- | --- | --- | --- |
| Path aliases | `vite.config.ts` → `resolve.alias` | `package.json` → `alias` or tsconfig | Two config files to maintain |
| Tailwind | `@tailwindcss/vite` plugin | PostCSS pipeline (`postcss.config.js`) | Different integration method |
| Environment variables | `import.meta.env.VITE_*` | `process.env.PLASMO_PUBLIC_*` | Different access patterns in shared code |
| Build cache | Turborepo + Vite cache | Parcel `.parcel-cache/` | Two caching systems |
| Package resolution | Vite `resolve` | Parcel resolver | May resolve `packages/*` differently |

**Can Plasmo work in a Vite monorepo?** Yes. Parcel can resolve pnpm workspace packages. It is not technically impossible.

**Should it?** For a solo/small team maintaining one monorepo, two bundler configurations means:
- Every Tailwind change touches two configs
- Every path alias change touches two configs
- Debugging build issues requires knowledge of both Vite and Parcel internals

```
Cost of bundler mismatch:
- Not a blocker, but a persistent tax on every config change
- Estimated: +30 minutes per config-level change across the monorepo
- Over 50 config changes/year: ~25 hours of additional overhead
```

**Verdict:** Plasmo is not eliminated on capability, but on **operational cost**. WXT and CRXJS advance.

### 3.2 Round 2: Framework vs Plugin

WXT and CRXJS are both Vite-based but fundamentally different in abstraction level.

| Aspect | WXT (Framework) | CRXJS (Plugin) |
| --- | --- | --- |
| **Manifest** | Auto-generated from file-based entrypoints | Hand-written `manifest.json` |
| **Content script declaration** | `defineContentScript()` with match patterns | Declare in manifest.json manually |
| **Shadow DOM** | Built-in `createShadowRootUi()` | **Not provided** — implement manually |
| **Side panel** | Drop `sidepanel.html` in entrypoints/ | Manually declare in manifest.json |
| **Background worker** | Drop `background.ts` in entrypoints/ | Manually declare in manifest.json |
| **CSS isolation** | `cssInjectionMode: 'ui'` — one line | Manual Shadow DOM + style injection |

Shadow DOM isolation comparison:

```tsx
// WXT — built-in
const ui = await createShadowRootUi(ctx, {
  name: 'ghosttalkie',
  cssInjectionMode: 'ui',  // styles scoped automatically
  onMount: (container) => {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
    return root;
  },
  onRemove: (root) => root?.unmount(),
});
```

```tsx
// CRXJS — manual implementation required
const host = document.createElement('div');
const shadow = host.attachShadow({ mode: 'open' });
const style = document.createElement('style');
style.textContent = '/* manually inject all CSS here */';
shadow.appendChild(style);
const mountPoint = document.createElement('div');
shadow.appendChild(mountPoint);
document.body.appendChild(host);
const root = ReactDOM.createRoot(mountPoint);
root.render(<App />);
// cleanup, style updates, HMR — all manual
```

**This matters for GhostTalkie specifically** because:
- Content scripts inject UI on OpenSea, Blur, and other NFT marketplaces
- These sites have complex CSS that will break unshadowed injected components
- Shadow DOM isolation is not optional — it is a hard requirement (Section 1.1)

### 3.3 Round 3: Maintenance and Longevity

| Metric | WXT | CRXJS |
| --- | --- | --- |
| Last major release | 2026 (current) | ~2023 |
| Chrome Side Panel API support | Yes (declarative) | No (API released after development stalled) |
| MV3 stability | Stable | Community-reported issues |
| Browser support | Chrome, Firefox, Edge, Safari | Chrome only |
| Open issues resolution | Active | Slow/stalled |

**Risk assessment:**

```
CRXJS risks:
- Side Panel API added to Chrome after CRXJS development slowed
  → No first-class support, manual manifest only
- MV3 evolves with Chrome updates
  → Stale plugin may break with future Chrome releases
- No Shadow DOM utilities
  → Must maintain custom implementation indefinitely

WXT risks:
- Framework-specific APIs to learn
  → Moderate learning curve (APIs map directly to Chrome concepts)
- Dependency on WXT project continuity
  → Mitigated by active maintenance and growing community
```

**Verdict:** CRXJS is eliminated on maintenance risk and missing Shadow DOM support. WXT wins.

---

## 4. Decision Matrix

### Quantitative Scoring

```
Scoring: 1 (Poor) to 10 (Excellent)
Weight: 10 (Critical) to 1 (Nice-to-have)
```

| Criterion | Weight | WXT | Plasmo | CRXJS | WXT Score | Plasmo Score | CRXJS Score |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Vite compatibility | 10 | 10 | 3 | 10 | 100 | 30 | 100 |
| Shadow DOM isolation | 10 | 10 | 8 | 2 | 100 | 80 | 20 |
| Side panel support | 9 | 10 | 8 | 4 | 90 | 72 | 36 |
| Monorepo package sharing | 9 | 9 | 5 | 9 | 81 | 45 | 81 |
| Maintenance activity | 8 | 9 | 8 | 2 | 72 | 64 | 16 |
| Content script DX | 7 | 8 | 10 | 4 | 56 | 70 | 28 |
| Multi-browser | 5 | 9 | 7 | 3 | 45 | 35 | 15 |
| Learning curve | 4 | 6 | 9 | 8 | 24 | 36 | 32 |
| Community / stars | 3 | 7 | 9 | 5 | 21 | 27 | 15 |

| | WXT | Plasmo | CRXJS |
| --- | --- | --- | --- |
| **Weighted Total** | **589** | **459** | **343** |
| **Percentage** | **90.6%** | **70.6%** | **52.8%** |

**Winner: WXT by 20+ percentage points.**

---

## 5. Counter-Arguments

### "Plasmo has better DX and more GitHub stars"

Plasmo's content script DX (export a component, done) is genuinely superior. But:
- The DX advantage is in **one surface** (content script declaration)
- The bundler mismatch cost applies to **every shared surface** (aliases, Tailwind, env vars, caching)
- Stars reflect popularity, not fit. Plasmo targets standalone extension projects; WXT targets Vite-based monorepos.

### "CRXJS is lighter — just a plugin, less lock-in"

True. But "light" also means:
- No Shadow DOM utilities (must build and maintain manually)
- No side panel support (must configure manifest manually)
- No active maintenance (must fix Chrome compatibility issues yourself)
- The cost of building what CRXJS doesn't provide exceeds the cost of learning WXT's APIs.

### "WXT has a learning curve"

WXT introduces these APIs:
- `defineContentScript()` — maps to `chrome.scripting`
- `createShadowRootUi()` — maps to `Element.attachShadow()`
- `defineConfig()` — maps to `vite.defineConfig()`
- File-based entrypoints — maps to `manifest.json` fields

Each API wraps a Chrome concept. The learning curve is **Chrome Extension APIs**, not WXT-specific abstractions.

---

## 6. Decision

**WXT.**

| Requirement | How WXT Satisfies |
| --- | --- |
| Content script with React UI | `defineContentScript()` + React mount |
| Shadow DOM isolation | `createShadowRootUi()` with `cssInjectionMode: 'ui'` |
| Side panel | `entrypoints/sidepanel.html` — declarative |
| Background service worker | `entrypoints/background.ts` — file-based |
| Manifest V3 | Stable support |
| Vite-compatible | Native Vite — identical resolution to `apps/web` |
| Monorepo sharing | TS reference paths + Vite resolve |
| Tailwind CSS | `@tailwindcss/vite` — same plugin as `apps/web` |

### When to Revisit

Consider alternatives **only when**:

```
Trigger 1: WXT maintenance stalls
- No releases for 6+ months
- Critical Chrome API changes go unsupported
- Action: Evaluate Plasmo (if Vite support added) or manual Vite setup

Trigger 2: Plasmo adds Vite support
- Bundler mismatch eliminated
- Re-evaluate based on content script DX advantage
- Action: Compare DX-to-DX with WXT

Trigger 3: Chrome Extension platform changes significantly
- New APIs that no framework supports
- Action: Evaluate manual setup or new entrants
```

**None of these triggers are active or near-term.**
