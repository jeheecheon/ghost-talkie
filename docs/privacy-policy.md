# Privacy Policy

**Last updated:** March 24, 2026

GhostTalkie is a peer-to-peer (P2P) chat application and browser extension that uses Web3 wallet addresses as user identity. This privacy policy explains how your data is handled.

## Summary

- We do **not** operate any servers or databases
- We do **not** collect, store, or transmit your personal data
- All chat messages are ephemeral and peer-to-peer
- Profile comments are stored on public Nostr relays, not controlled by us

## Data Stored on Your Device

The following data is stored locally using your browser's storage and never leaves your device:

- **Bookmarks** — wallet addresses you have bookmarked
- **Search history** — wallet addresses you have previously searched
- **Chat session state** — active room info, unread message counts, and pending join requests (cleared when the session ends)
- **Theme preference** — your selected display theme

You can clear this data at any time through your browser settings or by uninstalling the extension.

## Peer-to-Peer Communication

Text and voice messages are transmitted directly between peers via WebRTC. Messages are **ephemeral** — they exist only in memory during the active session and are never persisted to disk or any server.

Voice chat requires microphone access. Permission is requested only when you choose to enable voice chat. Audio is streamed directly to the other peer via WebRTC and is not recorded or stored.

WebRTC connections are established using Nostr relays for signaling only. The relays relay connection metadata (SDP offers/answers, ICE candidates) but do not have access to the content of your messages.

## Profile Comments

Comments posted on wallet profiles are published to public Nostr relays (relay.damus.io, nos.lol). These comments are:

- **Public** — visible to anyone querying the relay
- **Stored on third-party infrastructure** — retention depends on relay policies
- **Signed with a derived Nostr key** — linked to your wallet address via a published proof signature

GhostTalkie does not control Nostr relay data retention or availability.

## Wallet Connection

GhostTalkie connects to your Ethereum wallet through browser-injected providers (e.g., MetaMask) or WalletConnect via Reown. During wallet interaction:

- Your **wallet address** is used as your identity within the app
- **Signatures** are requested for identity verification (chat proof, Nostr key derivation)
- **Native token transfers** can be initiated from a wallet profile page — the extension constructs a standard transaction request and forwards it to your wallet software for signing and broadcasting. GhostTalkie does not process, intermediate, or store any transaction data
- **No private keys** are accessed, stored, or transmitted by GhostTalkie

## Third-Party Services

| Service                                | Purpose                            | Data Shared                    |
| -------------------------------------- | ---------------------------------- | ------------------------------ |
| Nostr relays (relay.damus.io, nos.lol) | WebRTC signaling, profile comments | Public keys, signed comments, signaling metadata (SDP, ICE candidates) |
| Reown (WalletConnect)                  | Wallet connection                  | Wallet address, chain ID       |
| Blockchain RPC providers               | Balance and transaction queries    | Wallet addresses queried       |
| Google STUN servers                    | WebRTC connectivity                | IP addresses (standard WebRTC) |

These services operate under their own privacy policies. GhostTalkie does not control how they handle data.

## Browser Extension Permissions

| Permission | Purpose                                                                          |
| ---------- | -------------------------------------------------------------------------------- |
| activeTab  | Detect wallet addresses on the current page and communicate with content scripts |
| storage    | Persist local preferences (bookmarks, search history, theme)                     |
| sidePanel  | Display the GhostTalkie chat interface                                           |

## Data We Do Not Collect

- No analytics or telemetry
- No cookies or tracking pixels
- No personal information (name, email, phone)
- No browsing history
- No IP address logging

## Children's Privacy

GhostTalkie does not knowingly collect data from children under 13. The application requires a Web3 wallet to use, which inherently requires users to be of appropriate age to manage cryptocurrency.

## Changes to This Policy

Updates will be posted at this URL with a revised date.

## Contact

For questions about this policy, open an issue at [github.com/jeheecheon/ghosttalkie](https://github.com/jeheecheon/ghosttalkie).
