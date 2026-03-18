# GhostTalkie

A fully serverless P2P chat application where your Ethereum wallet is your identity. No backend, no database — just static files, WebRTC, and public Nostr relays.

**[Live Demo](https://jeheecheon.github.io/ghost-talkie)**

## Why

Most chat apps require accounts, servers, and infrastructure that costs money to run. GhostTalkie explores a different approach: what if a real-time chat application could run at **zero infrastructure cost** while still providing cryptographic identity verification?

By combining WebRTC for direct peer-to-peer communication, Nostr relays for signaling and async comments, and Ethereum wallet signatures for authentication, GhostTalkie achieves this with no custom backend at all.

## Features

- **P2P Real-time Chat** — Text and voice communication directly between peers via WebRTC (up to 5 participants, mesh topology)
- **Wallet-based Identity** — No signup. Connect your Ethereum wallet, and your address becomes your identity
- **Cryptographic Verification** — Each peer signs a proof message; signatures are exchanged and verified on connect. Impersonation is impossible
- **Profile Comments via Nostr** — When a user is offline, visitors can leave comments stored on public Nostr relays
- **Multi-chain Token Balances** — View native token balances across Ethereum, Arbitrum, Base, Optimism, Polygon, and CROSS networks
- **Native Token Transfer** — Send tokens directly from a wallet profile page with automatic chain switching
- **Browser Extension** — WXT + React extension that injects chat buttons next to wallet addresses on external sites

## Architecture

```
ghosttalkie/
├── apps/
│   ├── web/                  # React Router v7 SPA (main web app)
│   └── extension/            # Browser extension (WXT + React)
├── packages/
│   ├── domain/               # Core business logic
│   │   ├── p2p/              #   WebRTC chat rooms, proof exchange
│   │   └── nostr/            #   Nostr identity, comments
│   ├── ui/                   # Shared React components and hooks
│   ├── lib/                  # Shared utilities
│   ├── types/                # Shared TypeScript types
│   ├── eslint-config/        # Shared ESLint configuration
│   └── tsconfig/             # Shared TypeScript configuration
└── turbo.json
```

The monorepo separates **domain logic** (P2P, Nostr) from **UI components**, allowing the web app and browser extension to share the same core without duplication.

## Tech Decisions

| Decision | Why |
|---|---|
| **Trystero (Nostr strategy)** for P2P | Zero-config WebRTC signaling over public Nostr relays — no signaling server needed, 8KB bundle |
| **Wallet signatures** for auth | Eliminates the entire auth backend. Cryptographic proof is stronger than email/password |
| **Nostr protocol** for comments | Free, censorship-resistant storage on public relays. No database to maintain |
| **Monorepo with domain package** | P2P and Nostr logic is framework-agnostic, reusable across web app and browser extension |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Router v7 (Vite, CSR) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| P2P | Trystero (WebRTC via Nostr relays) |
| Wallet | wagmi + viem + Reown AppKit |
| State | Zustand (persisted via localStorage) |
| Data Fetching | TanStack React Query |
| Build | Turborepo + pnpm workspaces |
| Deploy | GitHub Pages |

## How It Works

```
Owner                                          Visitor
  │                                               │
  ├─ Connect wallet                                │
  ├─ Open chat room on /{address}                  │
  │   └─ Sign chat proof (1 signature)             │
  │                                               ├─ Visit /{ownerAddress}
  │                                               ├─ Connect wallet
  │                                               ├─ Click "Chat"
  │                                               │   └─ Sign chat proof (1 signature)
  │◄──────── WebRTC connection established ───────►│
  │◄──────── Exchange & verify proofs ────────────►│
  │                                               │
  ├─ See visitor's verified address                ├─ Waiting for approval
  ├─ Accept or Reject                              │
  │                                               │
  │◄════════ Encrypted P2P chat (text/voice) ═════►│
```

## Cost

| Component | Cost |
|---|---|
| Hosting (GitHub Pages) | $0 |
| Signaling (public Nostr relays) | $0 |
| Comments storage (Nostr relays) | $0 |
| P2P data transfer | $0 |
| **Total** | **$0** |

## Getting Started

```bash
pnpm install
pnpm dev
```

Requires Node.js >= 20 and pnpm.
