# ChainMate — Serverless P2P Chat with Web3 Wallet Identity

## Overview

ChainMate is a fully serverless, P2P communication app that uses Web3 wallet addresses as user identity. It combines WebRTC (via Trystero) for peer-to-peer communication and Web3 wallets for authentication, identity verification, and crypto transfers.

**No backend server. No database. Static frontend only.**

---

## Core Principles

- **Serverless**: All communication happens P2P via Trystero (uses public Nostr/BitTorrent relays for signaling only)
- **Wallet = Identity**: Wallet address replaces email/password. Cryptographic signatures verify identity.
- **Zero Cost at Any Scale**: Static site + P2P = no infrastructure cost regardless of user count
- **Privacy First**: Messages flow directly between peers. No server ever sees or stores any data.

---

## Two Modes

### 1. Public Room (No Wallet Required)

Open chat rooms anyone can join without authentication. Zero friction entry point.

- User picks a nickname (or gets a random one)
- Joins a topic-based room via Trystero
- Chat with whoever is online
- Close tab = everything gone

**Predefined rooms:**

| Room | Topic |
|---|---|
| `public-general` | General chat |
| `public-defi` | DeFi discussion |
| `public-nft` | NFT talk |
| `public-dev` | Developer chat |

**Scaling**: WebRTC mesh supports ~30-50 peers per room. Topic-based sharding keeps each room within this limit.

### 2. Wallet Room (Wallet Required)

Private 1-on-1 communication with verified identity and crypto transfer capability.

- User connects wallet to open their room
- Others enter the wallet address (or ENS) to connect
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
  → Room opens: "inbox-{walletAddress}"
  → Wait for visitors
  → Visitor arrives → see their verified wallet address
  → Accept or Reject
  → Chat / Voice / Video / Send Crypto
```

### Wallet Room Flow — Visitor

```
Landing Page
  → Click "Connect to Wallet"
  → Enter target wallet address (0x...) or ENS (name.eth)
  → Connect own wallet
  → Sign identity message (one MetaMask popup)
  → Join room: "inbox-{targetWalletAddress}"
  → Auto-verify room owner's identity (signature check)
  → Send chat request
  → Wait for owner to accept
  → Chat / Voice / Video / Send Crypto
```

---

## Identity Verification Flow

Both parties verify each other using wallet signatures. No trust assumptions.

```
Owner opens room:
  1. Signs message: "I am the owner of {walletAddress}, session: {timestamp}"
  2. Stores signature in memory (reused for all visitors)

Visitor enters room:
  1. Signs message: "I am {visitorWallet}, entering room {ownerWallet}, session: {timestamp}"
  2. Receives owner's pre-signed proof → verifies against owner's claimed address
  3. Sends own proof to owner → owner verifies

Result:
  - Owner is cryptographically verified ✅
  - Visitor is cryptographically verified ✅
  - Impersonation is impossible (private key required to produce valid signature)
  - Each person signs exactly ONCE per session
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
┌─────────────────────────────────────────────────┐
│                    Client                        │
│              (Static Frontend)                   │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Trystero  │  │  wagmi   │  │  RainbowKit   │  │
│  │ (P2P)    │  │  + viem  │  │  (Wallet UI)  │  │
│  └────┬─────┘  └────┬─────┘  └───────────────┘  │
│       │              │                           │
│       │    ┌─────────┴─────────┐                 │
│       │    │  Wallet Actions   │                 │
│       │    │  - Sign messages  │                 │
│       │    │  - Verify sigs    │                 │
│       │    │  - Send tx        │                 │
│       │    └───────────────────┘                 │
│       │                                          │
│  ┌────┴──────────────────────────────────────┐   │
│  │           Trystero Rooms                   │  │
│  │                                            │  │
│  │  Public:  "public-general"                 │  │
│  │           "public-defi"                    │  │
│  │           "public-nft"                     │  │
│  │           "public-dev"                     │  │
│  │                                            │  │
│  │  Wallet:  "inbox-{walletAddress}"          │  │
│  └────────────────────────────────────────────┘  │
└──────────────────┬───────────────────────────────┘
                   │
          Trystero Signaling
          (Public Nostr relays)
                   │
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

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js (static export) | UI + routing |
| Styling | Tailwind CSS | Styling |
| P2P | Trystero (Nostr strategy) | Serverless WebRTC signaling + P2P data |
| Wallet Connection | wagmi + viem | Wallet connect, sign, verify, send tx |
| Wallet UI | RainbowKit | Wallet connect modal |
| Deploy | Vercel / GitHub Pages | Static hosting |

---

## Trystero Usage

### Signaling Strategy

Using **Nostr** (default) — zero setup, 8KB bundle, uses public relays.

```javascript
import { joinRoom } from 'trystero'  // Nostr by default

const room = joinRoom({ appId: 'chainmate' }, roomId)
```

### Room Naming Convention

| Type | Room ID Pattern | Example |
|---|---|---|
| Public | `public-{topic}` | `public-general` |
| Wallet | `inbox-{walletAddress}` | `inbox-0xABCD...1234` |

### Actions (Data Channels)

| Action ID | Purpose | Used In |
|---|---|---|
| `chat` | Text messages | Both modes |
| `owner-proof` | Owner sends wallet signature proof | Wallet room |
| `visitor-proof` | Visitor sends wallet signature proof | Wallet room |
| `request` | Visitor sends chat request | Wallet room |
| `response` | Owner sends accept/reject | Wallet room |
| `tx-notify` | Notify peer of crypto transaction | Wallet room |

### Media Streams

```javascript
room.addStream(localStream)  // Send audio/video
room.onPeerStream((stream, peerId) => { /* receive */ })
```

---

## Wallet Room Security Model

```
Threat: Impersonation
  → Attacker joins "inbox-0xABC" pretending to be owner
  → Visitor challenges all peers to sign a message
  → Only real owner has the private key for 0xABC
  → Attacker fails verification → identified and ignored

Threat: Man-in-the-middle
  → WebRTC uses DTLS encryption by default
  → Wallet signatures verify both endpoints
  → Even if signaling relays are compromised, data is encrypted P2P

Threat: Wrong address for crypto transfer
  → Recipient address is verified via wallet signature
  → UI auto-fills verified address, not user-typed input
  → Clipboard malware cannot intercept
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

| Component | Cost |
|---|---|
| Hosting (Vercel static) | $0 |
| Signaling (public Nostr relays) | $0 |
| P2P data transfer | $0 (users' own bandwidth) |
| STUN servers (Google public) | $0 |
| TURN relay (if P2P fails, ~15%) | $0-10/mo (free tier on Metered.ca) |
| **Total** | **$0** |

---

## Limitations

| Limitation | Detail |
|---|---|
| Both peers must be online | No offline messaging (P2P requires both parties) |
| No message persistence | Close tab = messages gone (by design) |
| Public room ~30-50 peer limit | WebRTC mesh topology constraint |
| TURN fallback needed ~15% | Some networks block direct P2P connections |
| Wallet required for private rooms | Non-crypto users limited to public rooms |

---

## Future Considerations

- **ENS Support**: Resolve `.eth` names to wallet addresses for easier room access
- **Token-gated Public Rooms**: Require specific token holdings to join certain rooms
- **File Sharing**: P2P file transfer via WebRTC data channel
- **Voice/Video**: WebRTC media streams for calls in wallet rooms
- **Mobile Wallet Support**: WalletConnect for mobile wallet apps
- **Optional TURN Server**: Self-hosted for reliability when P2P fails
