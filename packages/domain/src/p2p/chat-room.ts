import { type ActionSender, type Room, joinRoom, selfId } from "trystero/nostr";
import type { Address } from "viem";
import type {
  ChatMessage,
  ChatMessagePayload,
  ChatRequestPayload,
  ChatResponsePayload,
  ChatProof,
  LocalPeer,
  RemotePeer,
  PrivateChatRoomState,
  VoiceStatePayload,
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
import {
  determineChatRole,
  filterPeersByStatus,
} from "@workspace/domain/p2p/chat";
import { safelyGetAsync } from "@workspace/lib/safely";

type PrivateChatRoomJoinArgs = {
  roomAddress: Address;
  chatProof: ChatProof;
  onStateChange: (state: PrivateChatRoomState) => void;
};

export class PrivateChatRoom {
  private _messages: ChatMessage[] = [];
  private _remotePeers = new Map<string, RemotePeer>();
  private _pendingRequests = new Set<string>();
  private _isMicEnabling = false;
  private _isDestroyed = false;

  private constructor(
    private readonly _room: Room,
    private _localPeer: LocalPeer,
    private readonly _transmitResponse: ActionSender<ChatResponsePayload>,
    private readonly _transmitMessage: ActionSender<ChatMessagePayload>,
    private readonly _transmitVoiceState: ActionSender<VoiceStatePayload>,
    private readonly _onStateChange: (state: PrivateChatRoomState) => void,
  ) {}

  public static join({
    roomAddress,
    chatProof,
    onStateChange,
  }: PrivateChatRoomJoinArgs): PrivateChatRoom {
    const role = determineChatRole(chatProof);
    const status =
      role === PeerRole.Owner ? PeerStatus.Chatting : PeerStatus.Verifying;

    const localPeer: LocalPeer = {
      peerId: selfId,
      role,
      status,
      chatProof,
      isMicOn: false,
      stream: null,
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
    const [transmitVoiceState, onVoiceState] =
      room.makeAction<VoiceStatePayload>(RoomAction.VoiceState);

    const instance = new PrivateChatRoom(
      room,
      localPeer,
      transmitResponse,
      transmitMessage,
      transmitVoiceState,
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
    instance._bindVoiceEvents(onVoiceState);

    instance._emitStateChange();

    return instance;
  }

  public get status(): RoomStatus {
    const ownerLeft = [...this._remotePeers.values()].some(
      (p) => p.role === PeerRole.Owner && p.status === PeerStatus.Disconnected,
    );
    if (ownerLeft) {
      return RoomStatus.OwnerLeft;
    }

    if (this._hasPeerWith(PeerStatus.Chatting)) {
      return RoomStatus.Active;
    }

    if (
      this._hasPeerWith(
        PeerStatus.Verifying,
        PeerStatus.Requesting,
        PeerStatus.Pending,
      )
    ) {
      return RoomStatus.Waiting;
    }

    return RoomStatus.Empty;
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

  public async enableMic(): Promise<void> {
    if (
      this._isDestroyed ||
      this._localPeer.stream ||
      this._isMicEnabling ||
      this._localPeer.status !== PeerStatus.Chatting
    ) {
      return;
    }

    this._isMicEnabling = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (this._isDestroyed) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      this._room.addStream(stream);
      this.localPeer = { ...this.localPeer, isMicOn: true, stream };
      await this._transmitVoiceState({ isMicOn: true });
    } finally {
      this._isMicEnabling = false;
    }
  }

  public async disableMic(): Promise<void> {
    const { stream } = this._localPeer;
    if (this._isDestroyed || !stream) {
      return;
    }

    this._room.removeStream(stream);
    stream.getTracks().forEach((track) => track.stop());
    this.localPeer = { ...this.localPeer, isMicOn: false, stream: null };

    if (!this._isDestroyed) {
      await this._transmitVoiceState({ isMicOn: false });
    }
  }

  public async toggleMic(): Promise<void> {
    if (this._localPeer.stream) {
      await this.disableMic();
    } else {
      await this.enableMic();
    }
  }

  public destroy(): void {
    if (this._isDestroyed) {
      return;
    }

    this._isDestroyed = true;

    const { stream } = this._localPeer;
    if (stream) {
      this._room.removeStream(stream);
      stream.getTracks().forEach((track) => track.stop());
    }

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

      this._upsertPeer(peerId, {
        status: PeerStatus.Disconnected,
        isMicOn: false,
        stream: null,
      });
    });

    room.onPeerStream((stream, peerId) => {
      if (this._isDestroyed) {
        return;
      }

      this._upsertPeer(peerId, { stream });

      stream.addEventListener("removetrack", () => {
        if (this._isDestroyed) {
          return;
        }

        if (stream.getTracks().length === 0) {
          this._upsertPeer(peerId, { stream: null });
        }
      });
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
      if (this._isDestroyed) {
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

      this._evictStalePeers(peerId, senderRole);

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
        this.localPeer = { ...this.localPeer, status: PeerStatus.Requesting };
        return;
      }

      this._upsertPeer(peerId, {
        chatProof,
        role: senderRole,
      });

      if (this._pendingRequests.delete(peerId)) {
        this._upsertPeer(peerId, { status: PeerStatus.Requesting });
      }
    });

    if (this.localPeer.role === PeerRole.Owner) {
      actions.onRequest((_request, peerId) => {
        if (this._isDestroyed) {
          return;
        }

        const peer = this._remotePeers.get(peerId);
        if (!peer?.chatProof) {
          this._pendingRequests.add(peerId);
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

        this._upsertPeer(ownerPeer.peerId, {
          status: response.accepted
            ? PeerStatus.Chatting
            : PeerStatus.Disconnected,
        });

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

  private _bindVoiceEvents(
    onVoiceState: (
      cb: (payload: VoiceStatePayload, peerId: string) => void,
    ) => void,
  ): void {
    onVoiceState((payload, peerId) => {
      if (this._isDestroyed || !this._remotePeers.has(peerId)) {
        return;
      }

      this._upsertPeer(peerId, { isMicOn: payload.isMicOn });
    });
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
      isMicOn: updates.isMicOn ?? existingPeer?.isMicOn ?? false,
      stream: updates.stream ?? existingPeer?.stream ?? null,
    };

    const peers = new Map(this._remotePeers);
    peers.set(peerId, newPeer);
    this.remotePeers = peers;
  }

  private _evictStalePeers(currentPeerId: string, role: PeerRole): void {
    let removed = false;
    const peers = new Map(this._remotePeers);

    for (const [id, peer] of peers) {
      if (
        id !== currentPeerId &&
        peer.role === role &&
        peer.status === PeerStatus.Disconnected
      ) {
        peers.delete(id);
        removed = true;
      }
    }

    if (removed) {
      this.remotePeers = peers;
    }
  }

  private _hasPeerWith(...statuses: PeerStatus[]): boolean {
    const filtered = filterPeersByStatus(
      [...this._remotePeers.values()],
      ...statuses,
    );
    return !!filtered.length;
  }

  private _getChattingPeers(): RemotePeer[] {
    return filterPeersByStatus(
      [...this._remotePeers.values()],
      PeerStatus.Chatting,
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
