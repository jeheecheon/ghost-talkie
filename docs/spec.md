# GhostTalkie — Serverless P2P Chat with Web3 Wallet Identity

## Overview

GhostTalkie is a fully serverless, P2P communication app that uses Web3 wallet addresses as user identity. It combines WebRTC (via Trystero) for real-time peer-to-peer communication, Nostr relays for profile comments, and Web3 wallets for authentication and identity verification.

**No backend server. No database. Static frontend only.**

---

## Core Principles

- **Serverless**: Private chat via Trystero P2P, profile comments via public Nostr relays. No custom backend.
- **Wallet = Identity**: Wallet address replaces email/password. Cryptographic signatures verify identity.
- **Zero Cost at Any Scale**: Static site + P2P + public relays = no infrastructure cost regardless of user count
- **Privacy First**: Real-time messages flow directly between peers. Profile comments are stored on public Nostr relays.

---

## Private Chat via Wallet Profile (Wallet Required)

Multi-peer private communication (up to 5 participants) initiated from the WalletProfile page (`/{walletAddress}`). Chat opens as an overlay widget on the profile page.

- All parties must have wallets connected
- Profile owner must be online with room open (Trystero WebRTC)
- Visitor clicks "Chat" button on owner's profile page to initiate connection
- WebRTC direct connection: text, voice (mesh topology)
- Messages are ephemeral — never stored, direct P2P only
- Owner offline → visitor can only leave profile comments (Nostr)

---

## User Flow

### Private Chat Flow — Profile Owner

```
Connect wallet → navigate to own profile (/{walletAddress})
  → Sign Nostr identity messages (two MetaMask popups: key derivation + proof)
    → Ethereum identity established
    → Nostr identity auto-derived from wallet signature
  → Click "Start Chat" on profile page
  → Sign chat proof message (one MetaMask popup)
  → Chat widget opens as overlay on profile page
  → Room opens: "inbox-{walletAddress}" (Trystero WebRTC)
  → Status: Online — accepting visitors
  → Visitor arrives → see their verified wallet address
  → Accept or Reject
  → Chat (text / voice)
```

### Private Chat Flow — Visitor

```
Visit profile: ghosttalkie.com/{walletAddress}
  → Connect own wallet
  → Sign Nostr identity messages (two MetaMask popups: key derivation + proof)
  → Click "Chat" button on profile page
  → Sign chat proof message (one MetaMask popup)
  → Chat widget opens as overlay on profile page
  → Owner online → join room "inbox-{ownerWalletAddress}" (WebRTC)
    → Exchange chat proofs (automatic verification)
    → Chat (text / voice)
  → Owner offline → leave a comment on profile (stored on Nostr relay)
```

---

## Communication Channels

### Private Chat — Trystero WebRTC (via Wallet Profile)

```
Profile owner online:
  → Visitor clicks "Chat" on /{walletAddress} profile
  → Chat widget opens as overlay (not a separate route)
  → Trystero P2P (WebRTC) for real-time text and voice
  → Messages are direct, never stored anywhere

Profile owner offline:
  → Visitor leaves a comment on profile (Nostr event tagged with owner's wallet)
  → Nostr relay stores the comment (free, public infrastructure)
  → Owner sees comments on next visit
```

---

## Wallet Signatures

Users manage only their Ethereum wallet. Signatures are split by purpose.

### Nostr Identity (for profile comments)

Two MetaMask signatures to establish Nostr identity:

- **Signature 1** — Key derivation (never published): `sha256(signature)` → Nostr private key → Nostr public key
- **Signature 2** — Proof of ownership (published on relay): stored in Nostr event tags

Key properties:
- Same wallet always produces same Nostr identity
- Key derivation signature is NEVER published — only proof-sig is public
- User never sees or manages Nostr keys

### Chat Proof (for private chat)

One MetaMask signature to enter a chat room. Separate from Nostr identity.

- **Owner proof**: Signs message identifying as room owner with room address + session timestamp
- **Visitor proof**: Signs message identifying as visitor with visitor address + room address + session timestamp
- Proofs are exchanged over WebRTC on peer connect and verified via `verifyMessage()`
- Proofs expire after 5 minutes for freshness

---

## On-chain Profile (Trust Signal)

When a visitor enters a wallet room, the owner's on-chain data is displayed as a trust profile.

```
┌─────────────────────────────┐
│ 0xABC...1234                │
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

Both parties verify each other via chat proofs exchanged over WebRTC.

- Each peer signs a role-specific chat proof message (owner or visitor) and sends it on connect
- Recipient verifies the signature against the claimed wallet address via `verifyMessage()`
- Both parties are cryptographically verified before chat begins
- Proofs include session timestamp and expire after 5 minutes
- Impersonation is impossible (private key required to produce valid signature)

### Profile Comments (Async)

Two-layer signing ensures comment authenticity and Owner badge.

- **Layer 1**: Nostr signature — proves the Nostr key authored the event
- **Layer 2**: Wallet proof-sig in tags — proves the wallet owns the Nostr key
- If wallet matches profile owner → Owner badge
- proof-sig is safe to publish (different from key derivation signature; Nostr private key stays secret)

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                     Client                            │
│               (Static Frontend)                       │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐       │
│  │ Trystero  │  │  wagmi   │  │  Reown        │      │
│  │ (P2P)    │  │  + viem  │  │  (Wallet UI)  │      │
│  └────┬─────┘  └────┬─────┘  └───────────────┘       │
│       │              │                                │
│       │    ┌─────────┴─────────┐  ┌──────────────┐   │
│       │    │  Wallet Actions   │  │ Nostr Client │   │
│       │    │  - Sign messages  │  │ - Comments   │   │
│       │    │  - Verify sigs    │  │ - Key derive │   │
│       │    └───────────────────┘  └──────┬───────┘   │
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
| Wallet UI         | Reown (TBD)               | Wallet connect modal                          |
| On-chain Data     | Etherscan / Alchemy API   | Wallet profile, trust signals                 |
| Deploy            | Vercel / GitHub Pages     | Static hosting                                |

---

## Trystero Usage

### Signaling Strategy

Using **Nostr** — zero setup, 8KB bundle, uses public relays. Import from `trystero/nostr`.

### Room Naming Convention

| Type        | Room ID Pattern         | Example               |
| ----------- | ----------------------- | --------------------- |
| Wallet      | `inbox-{walletAddress}` | `inbox-0xABCD...1234` |

### URL Routing

| URL Pattern                              | Action                     |
| ---------------------------------------- | -------------------------- |
| `ghosttalkie.com/`                       | Landing page               |
| `ghosttalkie.com/{walletAddress}`        | Wallet profile page (chat widget overlays here) |

### Actions (Data Channels)

| Action ID       | Purpose                              | Used In     |
| --------------- | ------------------------------------ | ----------- |
| `message`       | Text messages                        | Wallet room |
| `proof`         | Each peer sends wallet signature proof | Wallet room |
| `request`       | Visitor sends chat request           | Wallet room |
| `response`      | Owner sends accept/reject            | Wallet room |
| `voice-state`   | Broadcast mic on/off status          | Wallet room |

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
```

---

## Peer Lifecycle (Private Chat)

```
1. SIGN        → User signs chat proof (owner or visitor role)
2. OPEN        → Profile owner opens room "inbox-{walletAddress}" via chat widget
3. CONNECT     → Visitor clicks "Chat" on profile → Trystero joins room
4. VERIFY      → Exchange chat proofs over WebRTC (automatic, 5-min expiry)
5. REQUEST     → Visitor sends chat request
6. APPROVE     → Owner accepts or rejects
7. CHAT        → Text, voice (up to 5 peers, mesh topology)
8. DISCONNECT  → Either peer closes tab → connection ends
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
| **Total**                       | **$0**                             |

---

## Limitations

| Limitation                        | Detail                                                          |
| --------------------------------- | --------------------------------------------------------------- |
| Real-time chat needs both online  | Owner offline → profile comments only (no voice)                |
| Comment persistence               | Depends on Nostr relay retention policy (days to months)        |
| Wallet required for all features  | Non-crypto users cannot participate                             |
| On-chain profile accuracy         | Only as good as public API data; no off-chain reputation        |
| Voice chat peer limit             | Mesh topology limits practical use to ~5 peers                  |

---

## Future Considerations

- **Crypto Transfer**: P2P crypto transfer with verified recipient address within chat
- **File Sharing**: P2P file transfer via WebRTC data channel
- **Mobile Wallet Support**: WalletConnect for mobile wallet apps
- **Browser Extension**: Inject GhostTalkie button next to wallet addresses on NFT marketplaces (blur.io, OpenSea, etc.)
- **OTC Trade Room**: P2P negotiation with smart contract escrow
