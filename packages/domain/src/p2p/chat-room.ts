import { type ActionSender, type Room, joinRoom, selfId } from "trystero/nostr";
import type { Address } from "viem";
import { safelyGetAsync } from "@workspace/lib/safely";
import type {
  ChatMessage,
  ChatMessagePayload,
  ChatRequestPayload,
  ChatResponsePayload,
  ChatProof,
  LocalPeer,
  RemotePeer,
  PrivateChatRoomState,
} from "@workspace/domain/p2p/types";
import {
  PeerRole,
  PeerStatus,
  RoomAction,
  RoomStatus,
} from "@workspace/domain/p2p/types";
import {
  verifyOwnerProof,
  verifyVisitorProof,
} from "@workspace/domain/p2p/chat-proof";
import { determineChatRole } from "@workspace/domain/p2p/chat";

type PrivateChatRoomJoinArgs = {
  roomAddress: Address;
  chatProof: ChatProof;
  onStateChange: (state: PrivateChatRoomState) => void;
};

export class PrivateChatRoom {
  private _messages: ChatMessage[] = [];
  private _remotePeers = new Map<string, RemotePeer>();
  private _isDestroyed = false;

  private constructor(
    private readonly _room: Room,
    private _localPeer: LocalPeer,
    private readonly _transmitResponse: ActionSender<ChatResponsePayload>,
    private readonly _transmitMessage: ActionSender<ChatMessagePayload>,
    private readonly _onStateChange: (state: PrivateChatRoomState) => void,
  ) {}

  public static join({
    roomAddress,
    chatProof,
    onStateChange,
  }: PrivateChatRoomJoinArgs): PrivateChatRoom {
    const localPeer: LocalPeer = {
      peerId: selfId,
      role: determineChatRole(chatProof),
      status: PeerStatus.Verifying,
      chatProof,
    };

    const room = joinRoom({ appId: "ghosttalkie" }, `inbox-${roomAddress}`);
    const [transmitProof, onProof] = room.makeAction<ChatProof>(
      RoomAction.Proof,
    );
    const [transmitRequest, onRequest] = room.makeAction<ChatRequestPayload>(
      RoomAction.Request,
    );
    const [transmitResponse, onResponse] = room.makeAction<ChatResponsePayload>(
      RoomAction.Response,
    );
    const [transmitMessage, onMessage] = room.makeAction<ChatMessagePayload>(
      RoomAction.Message,
    );

    const instance = new PrivateChatRoom(
      room,
      localPeer,
      transmitResponse,
      transmitMessage,
      onStateChange,
    );

    instance._bindPeerEvents(room, transmitProof);
    instance._bindRoleEvents({
      onProof,
      onRequest,
      onResponse,
      transmitRequest,
    });
    instance._bindMessageEvent(onMessage);

    instance._emitStateChange();

    return instance;
  }

  public get status(): RoomStatus {
    const isActive = [...this._remotePeers.values()].some(
      (p) =>
        p.status === PeerStatus.Verifying ||
        p.status === PeerStatus.Requesting ||
        p.status === PeerStatus.Pending ||
        p.status === PeerStatus.Chatting,
    );
    return isActive ? RoomStatus.Active : RoomStatus.Waiting;
  }

  public get messages(): readonly ChatMessage[] {
    return this._messages;
  }

  private set messages(value: ChatMessage[]) {
    if (this._isDestroyed) {
      return;
    }

    this._messages = value;
    this._emitStateChange();
  }

  public get remotePeers(): ReadonlyMap<string, RemotePeer> {
    return this._remotePeers;
  }

  private set remotePeers(value: Map<string, RemotePeer>) {
    if (this._isDestroyed) {
      return;
    }

    this._remotePeers = value;
    this._emitStateChange();
  }

  public get localPeer(): LocalPeer {
    return this._localPeer;
  }

  private set localPeer(value: LocalPeer) {
    if (this._isDestroyed) {
      return;
    }

    this._localPeer = value;
    this._emitStateChange();
  }

  public async sendMessage(text: string): Promise<void> {
    const chattingPeers = this._getChattingPeers();
    if (chattingPeers.length === 0) {
      return;
    }

    await this._transmitMessage(
      { text, sender: this.localPeer.chatProof.signerAddress },
      chattingPeers.map((p) => p.peerId),
    );
    this._pushMessage({ text, sender: this.localPeer.chatProof.signerAddress });
  }

  public async respond(peerId: string, accepted: boolean): Promise<void> {
    const peer = this._remotePeers.get(peerId);
    if (
      this.localPeer.role !== PeerRole.Owner ||
      !peer ||
      peer.status !== PeerStatus.Requesting
    ) {
      return;
    }

    const chattingPeers = this._getChattingPeers();
    const targetIds = [peerId, ...chattingPeers.map((p) => p.peerId)];
    await this._transmitResponse({ accepted, targetPeerId: peerId }, targetIds);
    this._upsertPeer(peerId, {
      status: accepted ? PeerStatus.Chatting : PeerStatus.Rejected,
    });
  }

  public destroy(): void {
    if (this._isDestroyed) {
      return;
    }

    this._isDestroyed = true;
    this._room.leave();
    this._remotePeers.clear();
    this._messages = [];
  }

  private _bindPeerEvents(
    room: Room,
    transmitProof: ActionSender<ChatProof>,
  ): void {
    room.onPeerJoin(async (peerId) => {
      if (this._isDestroyed) {
        return;
      }

      this._upsertPeer(peerId, {
        status: PeerStatus.Verifying,
        role: PeerRole.Unknown,
      });
      await transmitProof(this.localPeer.chatProof, [peerId]);
    });

    room.onPeerLeave((peerId) => {
      if (this._isDestroyed || !this._remotePeers.has(peerId)) {
        return;
      }

      this._upsertPeer(peerId, { status: PeerStatus.Disconnected });
    });
  }

  private _bindRoleEvents(actions: {
    onProof: (callback: (chatProof: ChatProof, peerId: string) => void) => void;
    onRequest: (
      callback: (request: ChatRequestPayload, peerId: string) => void,
    ) => void;
    onResponse: (
      callback: (response: ChatResponsePayload, peerId: string) => void,
    ) => void;
    transmitRequest: ActionSender<ChatRequestPayload>;
  }): void {
    actions.onProof(async (chatProof, peerId) => {
      if (this._isDestroyed || !this._remotePeers.has(peerId)) {
        return;
      }

      const senderRole = determineChatRole(chatProof);
      const verify =
        senderRole === PeerRole.Owner ? verifyOwnerProof : verifyVisitorProof;
      const isValid = await safelyGetAsync(() => verify(chatProof));
      if (!isValid) {
        this._upsertPeer(peerId, { status: PeerStatus.Failed });
        return;
      }

      if (
        this.localPeer.role === PeerRole.Visitor &&
        senderRole === PeerRole.Owner
      ) {
        await actions.transmitRequest({}, [peerId]);
        this._upsertPeer(peerId, {
          chatProof,
          role: senderRole,
          status: PeerStatus.Pending,
        });
        return;
      }

      this._upsertPeer(peerId, {
        chatProof,
        role: senderRole,
      });
    });

    if (this.localPeer.role === PeerRole.Owner) {
      actions.onRequest((_request, peerId) => {
        if (this._isDestroyed || !this._remotePeers.has(peerId)) {
          return;
        }

        this._upsertPeer(peerId, { status: PeerStatus.Requesting });
      });
    }

    if (this.localPeer.role === PeerRole.Visitor) {
      actions.onResponse((response, peerId) => {
        const ownerPeer = this._remotePeers.get(peerId);
        const isOwner = ownerPeer?.role === PeerRole.Owner;

        if (this._isDestroyed || !isOwner) {
          return;
        }

        if (this._remotePeers.has(response.targetPeerId)) {
          this._upsertPeer(response.targetPeerId, {
            status: response.accepted
              ? PeerStatus.Chatting
              : PeerStatus.Rejected,
          });
        }

        if (this.localPeer.peerId === response.targetPeerId) {
          this.localPeer = {
            ...this.localPeer,
            status: response.accepted
              ? PeerStatus.Chatting
              : PeerStatus.Rejected,
          };
        }
      });
    }
  }

  private _bindMessageEvent(
    onMessage: (
      cb: (message: ChatMessagePayload, peerId: string) => void,
    ) => void,
  ): void {
    onMessage((message, peerId) => {
      const peer = this._remotePeers.get(peerId);
      if (
        peer?.status !== PeerStatus.Chatting ||
        peer.chatProof?.signerAddress !== message.sender
      ) {
        return;
      }

      this._pushMessage(message);
    });
  }

  private _pushMessage(args: { text: string; sender: Address }): void {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...args,
    };
    this.messages = [...this._messages, newMessage];
  }

  private _upsertPeer(
    peerId: string,
    updates: Partial<Omit<RemotePeer, "peerId">>,
  ): void {
    const existingPeer = this._remotePeers.get(peerId);
    const newPeer: RemotePeer = {
      peerId,
      chatProof: updates.chatProof ?? existingPeer?.chatProof ?? null,
      status: updates.status ?? existingPeer?.status ?? PeerStatus.Verifying,
      role: updates.role ?? existingPeer?.role ?? PeerRole.Unknown,
    };

    const peers = new Map(this._remotePeers);
    peers.set(peerId, newPeer);
    this.remotePeers = peers;
  }

  private _getChattingPeers(): RemotePeer[] {
    return [...this._remotePeers.values()].filter(
      (p) => p.status === PeerStatus.Chatting,
    );
  }

  private _emitStateChange(): void {
    this._onStateChange({
      localPeer: this.localPeer,
      status: this.status,
      messages: this._messages,
      remotePeers: [...this._remotePeers.values()],
    });
  }
}
