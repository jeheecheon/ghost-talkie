# GhostTalkie — Serverless P2P Chat with Web3 Wallet Identity

## Overview

GhostTalkie is a fully serverless, P2P communication app that uses Web3 wallet addresses as user identity. It combines WebRTC (via Trystero) for real-time peer-to-peer communication, Nostr relays for profile comments, and Web3 wallets for authentication, identity verification, and crypto transfers.

**No backend server. No database. Static frontend only.**

---

## Core Principles

- **Serverless**: Real-time chat via Trystero P2P, profile comments via public Nostr relays. No custom backend.
- **Wallet = Identity**: Wallet address replaces email/password. Cryptographic signatures verify identity.
- **Zero Cost at Any Scale**: Static site + P2P + public relays = no infrastructure cost regardless of user count
- **Privacy First**: Real-time messages flow directly between peers. Profile comments are stored on public Nostr relays.

---

## Two Modes

### 1. Public Room (No Wallet Required)

Open chat rooms anyone can join without authentication. Zero friction entry point.

- User picks a nickname (or gets a random one)
- Joins a topic-based room via Trystero
- Chat with whoever is online
- Close tab = everything gone

**Predefined rooms:**

| Room             | Topic           |
| ---------------- | --------------- |
| `public-general` | General chat    |
| `public-defi`    | DeFi discussion |
| `public-nft`     | NFT talk        |
| `public-dev`     | Developer chat  |

**Scaling**: WebRTC mesh supports ~30-50 peers per room. Topic-based sharding keeps each room within this limit.

### 2. Wallet Room (Wallet Required)

Private 1-on-1 communication with verified identity and crypto transfer capability.

- User connects wallet to open their room
- Share room URL: `ghosttalkie.com/{walletAddress}` or `ghosttalkie.com/{ENS}`
- Others visit the URL or enter the wallet address to connect
- Both parties verify each other via wallet signatures
- Room owner approves/rejects visitors
- Crypto transfers possible within the chat

---

## User Flow

### Public Room Flow

```
Landing Page
  → Select a topic room (general, defi, nft, dev)
  → Enter nickname
  → Join room (Trystero P2P)
  → Chat with peers
  → Close tab = done
```

### Wallet Room Flow — Owner

```
Landing Page
  → Click "Open My Room"
  → Connect wallet (MetaMask / RainbowKit)
  → Sign session message (one MetaMask popup)
    → Ethereum identity established
    → Nostr identity auto-derived from wallet signature
  → Room opens: "inbox-{walletAddress}"
  → Share URL: ghosttalkie.com/{walletAddress}
  → Check profile comments (from Nostr relay)
  → Wait for visitors
  → Visitor arrives → see their verified wallet address + on-chain profile
  → Accept or Reject
  → Chat / Voice / Video / Send Crypto
```

### Wallet Room Flow — Visitor

```
Option A: Visit URL directly
  → ghosttalkie.com/0xABC...1234

Option B: Manual entry
  → Landing Page → Enter target wallet address (0x...) or ENS (name.eth)

Then:
  → Connect own wallet
  → Sign identity message (one MetaMask popup)
  → Join room: "inbox-{targetWalletAddress}"
  → Owner online → real-time P2P chat (WebRTC)
  → Owner offline → leave a comment on profile (stored on Nostr relay)
  → Auto-verify room owner's identity (signature check)
  → Chat / Voice / Video / Send Crypto
```

---

## Hybrid Communication: Nostr + WebRTC

Nostr relays serve dual purpose: Trystero signaling AND profile comment storage.

```
Both online:
  → Trystero P2P (WebRTC) for real-time chat, voice, video
  → Messages are direct, never stored anywhere

Owner offline:
  → Visitor leaves a comment on owner's profile (Nostr event tagged with owner's wallet)
  → Nostr relay stores the comment (free, public infrastructure)
  → Owner sees comments on next visit

Transition:
  → Owner comes online → reads profile comments from relay
  → Both online → real-time P2P chat (WebRTC)
```

---

## Wallet Sign (One-Time Setup)

Users manage only their Ethereum wallet. Two MetaMask signatures during first setup handle everything.

```
User connects wallet (0xABC) and signs twice (one-time setup):

  Signature 1 — Key derivation (never published):
    Message: "GhostTalkie key for {walletAddress}"
    → sha256(signature) → Nostr private key → Nostr public key (abc123)

  Signature 2 — Proof of ownership (published on relay):
    Message: "GhostTalkie: {walletAddress} owns Nostr {nostrPubkey}"
    → proof-sig stored in event tags

Result:
  - Nostr keypair derived from sig 1 (for profile comments, auto-signing)
  - proof-sig from sig 2 (for Owner badge verification)
  - Key derivation input (sig 1) is NEVER published — only proof-sig (sig 2) is public
  - Same wallet always produces same Nostr identity
  - User never sees or manages Nostr keys
```

---

## On-chain Profile (Trust Signal)

When a visitor enters a wallet room, the owner's on-chain data is displayed as a trust profile.

```
┌─────────────────────────────┐
│ 0xABC...1234                │
│ ENS: alice.eth              │
│ Wallet age: 2.3 years       │
│ Tx count: 847               │
│ Top tokens: ETH, USDC, ARB  │
│ NFTs: 12 collections        │
└─────────────────────────────┘
```

Data is read-only, fetched from public blockchain APIs (Etherscan, Alchemy, etc.). No backend required.

---

## Identity Verification

### P2P Chat (Real-time)

Both parties verify each other via wallet signatures exchanged over WebRTC.

```
Owner opens room:
  1. Uses wallet-sig from initial sign (proves ownership of room address)
  2. Sends proof to visitors automatically

Visitor enters room:
  1. Signs message: "I am {visitorWallet}, entering room {ownerWallet}, session: {timestamp}"
  2. Receives owner's proof → verifies against room address
  3. Sends own proof to owner → owner verifies

Result:
  - Both parties cryptographically verified
  - Impersonation impossible (private key required)
```

### Profile Comments (Async)

Two-layer signing ensures comment authenticity and Owner badge.

```
Nostr Event structure:
  ┌────────────────────────────────────────────┐
  │ content:    "Welcome to my profile!"        │
  │ pubkey:     abc123 (Nostr public key)       │  ← Layer 1: Nostr signature
  │ sig:        ██████ (signed by Nostr key)    │     "abc123 wrote this event"
  │                                             │
  │ tags:                                       │
  │   wallet:     "0xABC"                       │  ← Layer 2: proof-sig
  │   wallet-sig: "██████"                      │     "0xABC owns abc123"
  └────────────────────────────────────────────┘

Verification (client-side):
  1. Verify Nostr sig → confirms abc123 authored this event
  2. Verify proof-sig against "GhostTalkie: 0xABC owns Nostr abc123"
     → confirms wallet 0xABC claimed ownership of abc123
  3. If wallet 0xABC === profile owner → Owner badge

Security:
  - proof-sig is public on relay, but safe:
    → proof-sig is a DIFFERENT signature from the key derivation signature
    → Key derivation sig is never published → Nostr private key stays secret
    → Attacker copies proof-sig + creates event with their own Nostr key (xyz789)
    → proof-sig says "0xABC owns abc123", but event pubkey is xyz789
    → Verifier reconstructs message with xyz789 → signature mismatch → fails
    → Attacker cannot forge abc123's Nostr signature without the Nostr private key
```

---

## Crypto Transfer Flow

Available in Wallet Rooms only. Both wallets are connected and verified.

```
User A clicks "Send Crypto"
  → UI shows: recipient address (pre-filled, verified ✅)
  → Enter amount + select token (ETH, USDC, etc.)
  → Click Send → MetaMask transaction popup
  → Transaction submitted on-chain
  → Tx hash shared with peer via data channel
  → Peer sees: "Received 0.01 ETH! Tx: 0x7f3a..."
```

**Safety advantage**: Recipient address is verified via wallet signature. Impossible to send to wrong address. Safer than copy-pasting addresses from Telegram/Discord.

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                     Client                            │
│               (Static Frontend)                       │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐       │
│  │ Trystero  │  │  wagmi   │  │  RainbowKit   │      │
│  │ (P2P)    │  │  + viem  │  │  (Wallet UI)  │      │
│  └────┬─────┘  └────┬─────┘  └───────────────┘       │
│       │              │                                │
│       │    ┌─────────┴─────────┐  ┌──────────────┐   │
│       │    │  Wallet Actions   │  │ Nostr Client │   │
│       │    │  - Sign messages  │  │ - Comments   │   │
│       │    │  - Verify sigs    │  │ - Key derive │   │
│       │    │  - Send tx        │  └──────┬───────┘   │
│       │    └───────────────────┘         │            │
│       │                                  │            │
│  ┌────┴──────────────────────────────────┴────────┐   │
│  │              Communication Layer                │  │
│  │                                                 │  │
│  │  Real-time:  Trystero WebRTC (both online)     │  │
│  │  Async:      Nostr relay events (comments)      │  │
│  └─────────────────────────────────────────────────┘  │
└──────────────────┬────────────────────────────────────┘
                   │
          ┌────────┴────────┐
          │                 │
   Trystero Signaling   Nostr Events
   (peer discovery)     (profile comments)
          │                 │
          └────────┬────────┘
                   ▼
        ┌─────────────────────┐
        │   Public Nostr      │
        │   Relays (free)     │
        │   - relay.damus.io  │
        │   - nos.lol         │
        └─────────────────────┘
                   │
                   ▼
            P2P Connection
         (Direct WebRTC between peers)
```

---

## Tech Stack

| Layer             | Technology                | Purpose                                       |
| ----------------- | ------------------------- | --------------------------------------------- |
| Framework         | Vite + React              | UI + routing (CSR, static)                    |
| Styling           | Tailwind CSS v4           | Styling                                       |
| UI Components     | shadcn/ui                 | Accessible, customizable component primitives |
| P2P               | Trystero (Nostr strategy) | Serverless WebRTC signaling + P2P data        |
| Profile Comments  | Nostr protocol (nostr-tools) | Publish/query comments on public relays    |
| Wallet Connection | wagmi + viem              | Wallet connect, sign, verify, send tx         |
| Wallet UI         | RainbowKit                | Wallet connect modal                          |
| On-chain Data     | Etherscan / Alchemy API   | Wallet profile, trust signals                 |
| Deploy            | Vercel / GitHub Pages     | Static hosting                                |

---

## Trystero Usage

### Signaling Strategy

Using **Nostr** (default) — zero setup, 8KB bundle, uses public relays.

```javascript
import { joinRoom } from "trystero"; // Nostr by default

const room = joinRoom({ appId: "ghosttalkie" }, roomId);
```

### Room Naming Convention

| Type   | Room ID Pattern         | Example               |
| ------ | ----------------------- | --------------------- |
| Public | `public-{topic}`        | `public-general`      |
| Wallet | `inbox-{walletAddress}` | `inbox-0xABCD...1234` |

### URL Routing

| URL Pattern                         | Action                     |
| ----------------------------------- | -------------------------- |
| `ghosttalkie.com/`                  | Landing page               |
| `ghosttalkie.com/rooms`             | Public room list           |
| `ghosttalkie.com/{walletAddress}`   | Enter wallet room          |
| `ghosttalkie.com/{ENS}`            | Resolve ENS → wallet room  |

### Actions (Data Channels)

| Action ID       | Purpose                              | Used In     |
| --------------- | ------------------------------------ | ----------- |
| `chat`          | Text messages                        | Both modes  |
| `owner-proof`   | Owner sends wallet signature proof   | Wallet room |
| `visitor-proof` | Visitor sends wallet signature proof | Wallet room |
| `request`       | Visitor sends chat request           | Wallet room |
| `response`      | Owner sends accept/reject            | Wallet room |
| `tx-notify`     | Notify peer of crypto transaction    | Wallet room |

### Media Streams

```javascript
room.addStream(localStream); // Send audio/video
room.onPeerStream((stream, peerId) => {
  /* receive */
});
```

---

## Security Model

```
Threat: Room impersonation (P2P)
  → Attacker joins "inbox-0xABC" pretending to be owner
  → Cannot produce valid wallet-sig for 0xABC → verification fails

Threat: Comment Owner badge forgery (Nostr)
  → Attacker copies proof-sig from relay
  → Cannot sign Nostr event as abc123 (key derivation sig is never published)
  → Event pubkey mismatch → verification fails

Threat: Man-in-the-middle
  → WebRTC DTLS encryption + wallet signatures verify both endpoints
  → Compromised relays cannot read P2P traffic

Threat: Wrong crypto transfer address
  → Recipient address is verified via wallet signature
  → UI auto-fills verified address, not user-typed input
```

---

## Peer Lifecycle (Wallet Room)

```
1. CONNECT     → Trystero connects peers in same room
2. VERIFY      → Exchange wallet signature proofs (automatic)
3. REQUEST     → Visitor sends chat request with message
4. APPROVE     → Owner accepts or rejects
5. CHAT        → Text, voice, video, file sharing, crypto transfer
6. DISCONNECT  → Either peer closes tab → connection ends
```

---

## Cost Analysis

| Component                       | Cost                               |
| ------------------------------- | ---------------------------------- |
| Hosting (Vercel static)         | $0                                 |
| Signaling (public Nostr relays) | $0                                 |
| Profile comments (Nostr relays) | $0                                 |
| P2P data transfer               | $0 (users' own bandwidth)          |
| STUN servers (Google public)    | $0                                 |
| On-chain data (Etherscan free)  | $0                                 |
| TURN relay (if P2P fails, ~15%) | $0-10/mo (free tier on Metered.ca) |
| **Total**                       | **$0**                             |

---

## Limitations

| Limitation                        | Detail                                                          |
| --------------------------------- | --------------------------------------------------------------- |
| Real-time chat needs both online  | Owner offline → profile comments only (no voice/video)          |
| Comment persistence               | Depends on Nostr relay retention policy (days to months)        |
| Public room ~30-50 peer limit     | WebRTC mesh topology constraint                                 |
| TURN fallback needed ~15%         | Some networks block direct P2P connections                      |
| Wallet required for private rooms | Non-crypto users limited to public rooms                        |
| On-chain profile accuracy         | Only as good as public API data; no off-chain reputation        |

---

## Future Considerations

- **ENS Support**: Resolve `.eth` names to wallet addresses for easier room access
- **Token-gated Public Rooms**: Require specific token holdings to join certain rooms
- **File Sharing**: P2P file transfer via WebRTC data channel
- **Voice/Video**: WebRTC media streams for calls in wallet rooms
- **Mobile Wallet Support**: WalletConnect for mobile wallet apps
- **Optional TURN Server**: Self-hosted for reliability when P2P fails
- **Browser Extension**: "Chat with this wallet" button on Etherscan, OpenSea, etc.
- **OTC Trade Room**: P2P negotiation with smart contract escrow
