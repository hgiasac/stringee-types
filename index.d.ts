type StringeeVideoDimension =
  | {
      min: string;
      max: string;
    }
  | {
      ideal: string;
    };

type StringeeVideoDimensions = {
  width: StringeeVideoDimension;
  height: StringeeVideoDimension;
};

type StringeeIceServer = {
  urls: string;
  credential: string;
  username: string;
};

type StringeeOnAuthenticatedResponse = {
  r: number;
  requestId: number;
  userId: string;
  connectionId: string;
  message: string;
  ping_after_ms: number;
  projectId: number;
  clients: Array<{
    browserId: string;
    clientId: string;
    deviceName: string;
    platform: number;
  }>;
  ice_servers: StringeeIceServer[];
};

type StringeeRoomAddTrackEventData = {
  info: {
    roomId: string;
    track: StringeeRemoteTrack;
  };
};

type StringeeRoomRemoveTrackEventData = StringeeRoomAddTrackEventData & {
  track: StringeeVideoTrack;
};

type StringeeRoomJoinEventData = {
  info: {
    roomId: string;
    stringeeClientId: string;
    user: StringeeUserInfo;
  };
};

type StringeeRoomLeaveEventData = {
  info: {
    roomId: string;
    reason: string;
    removeAllStringeeClients: boolean;
    user: StringeeUserInfo;
  };
};

type RoomTrackMediaChangeEventData = {
  enable: boolean;
  mediaChange: "audio" | "video";
  track: StringeeVideoTrack;
};

type StringeeUserInfo = {
  attributes: any[];
  canCallout: boolean;
  chatCustomer: boolean;
  loginTime: number;
  userId: string;
};

type StringeeError = {
  r?: number;
  code?: number;
  jsError: Error;
  msg: string;
};

interface StringeeLocalTrack {
  screen: boolean;
  localVideoEnabled: boolean;
  muted: boolean;

  switchCamera(): void;
  enableLocalVideo(enabled: boolean): void;
  attach(): HTMLVideoElement;
  close(): void;
  detachAndRemove(): void;
  mute(muted: boolean): void;
  routeAudioToSpeaker(selectedSpeakerId: string): void;
  on(evName: "ready", callback: () => unknown): void;
}

interface StringeeRemoteTrack {
  audio: boolean;
  isPlayer: boolean;
  screen: boolean;
  serverId: string;
  stringeeClientPublish: string;
  userPublish: string;
  video: boolean;
}

type StringeePublishOptions = {
  audio?: boolean;
  video?: boolean;
  screen?: boolean;
  screenAudio?: boolean;
  videoDimensions?: StringeeVideoDimensions;
  mobileCamera?: "front" | "back";
  audioDeviceId?: string;
  videoDeviceId?: string;
};

interface StringeeConferenceRoom {
  mapServerIdTracks: any[];
  permissionControlRoom: boolean;
  permissionPublish: boolean;
  permissionSubscribe: boolean;
  record: boolean;
  roomId: string;
  stringeeClient: StringeeClient;
  tracks: any[];

  clearAllOnMethos(): void;
  subscribe(
    serverId: string,
    subscribeOptions?: StringeePublishOptions
  ): Promise<StringeeVideoTrack>;
  publish(localTrack: StringeeVideoTrack): Promise<void>;
  unpublish(localTrack: StringeeVideoTrack): void;
  leave(b: true): Promise<any>;
  sendMessage(msg: unknown): Promise<void>;
  unsubscribe(track: StringeeVideoTrack): Promise<void>;
  sendRenderLayoutInfo(e, t);

  on(
    evName: "joinroom",
    callback: (event: StringeeRoomJoinEventData) => unknown
  ): void;
  on(
    evName: "leaveroom",
    callback: (event: StringeeRoomLeaveEventData) => unknown
  ): void;
  on(evName: "message", callback: (event: any) => unknown): void;
  on(
    evName: "addtrack",
    callback: (event: StringeeRoomAddTrackEventData) => unknown
  ): void;
  on(
    evName: "removetrack",
    callback: (event: StringeeRoomRemoveTrackEventData) => unknown
  ): void;
  on(
    evName: "trackmediachange",
    callback: (event: RoomTrackMediaChangeEventData) => unknown
  ): void;
}

type StringeeDevice = {
  deviceId: string;
  label: string;
};

type StringeeCameraDevice = StringeeDevice;
type StringeeMicrophoneDevice = StringeeDevice;
type StringeeSpeakerDevice = StringeeDevice;

type StringeeDevicesInfo = {
  cameras: StringeeCameraDevice[];
  microphones: StringeeMicrophoneDevice[];
  speakers: StringeeSpeakerDevice[];
};

type StringeeMediaState = {
  isConnected: boolean;
  isLocal: boolean;
  localId: string;
  roomId: string;
  serverPcId: string;
  serverTrackId: string;
};

declare class StringeeClient {
  constructor(endpoints?: string[]);

  accessToken: string;
  allClients: string[];
  allClientsOfThisBrowser: string[];
  alreadyTried: boolean;
  browserId: string;
  deviceId: string;
  disconnectByUser: boolean;
  hasConnected: boolean;
  healtcheckInterval: number;
  ice_servers: StringeeIceServer[];
  lastTimeStampReceivedPacket: number;
  masterServer: any;
  numberOfRetryConnect: number;
  sessionId: string;
  socket: {
    alreadyTried: boolean;
    healthCheckInterval: number;
    serverAddr: string;
    userDisconnect: boolean;
    timeoutReconnectMethod: any;
    serverAddressIsDead: boolean;
  };
  stringeeServerAddrIndex: number;
  stringeeServerAddrs: string[];
  tempWebsocketURL: string[];
  timeoutToReconnect: 60000;
  userId: string;

  connect(access_token: string): void;

  on(evName: "connect", callback: () => unknown);
  on(
    evName: "authen",
    callback: (res: StringeeOnAuthenticatedResponse) => unknown
  ): void;
  on(evName: "disconnect", callback: () => unknown): void;
  on(evName: "requestnewtoken", callback: () => unknown): void;
  on(enName: "otherdeviceauthen", callback: (args: any) => unknown): void;
  on(
    enName: "chatmessage",
    callback: (message: StringeeMessage) => unknown
  ): void;
  on(
    enName: "chatmessagestate",
    callback: (message: StringeeChatMessageState) => unknown
  ): void;

  disconnect(): void;
  findCall2ByCallId(id: string): any;
  findCallByCallId(id: string): any;
  getBrowserId(): string;
  getClientId(): string;
  getURLToConnect(): string;
  isActiveClient(): boolean;
  sendCustomMessage(
    userId: string,
    message: Record<string, unknown>,
    callback: (message: string) => unknown
  );
  setThisClientIsActive(isActive: boolean): void;
}

declare class StringeeVideoTrack {
  constructor(client: StringeeClient, pubOptions: Record<string, any>);

  audio: boolean;
  audioDeviceId: string | null;
  callOnReady: boolean;
  isLocal: boolean;
  constraints: Record<string, any>;
  elements: any[];
  lastAudioBytesReceived: number;
  lastAudioBytesSent: number;
  lastTimestampGetBytes: number;
  lastVideoBytesReceived: number;
  lastVideoBytesSent: number;
  localAudioEnabled: boolean;
  localCandidatesForSend: any[];
  localId: string;
  localSdpToSend: any;
  localVideoEnabled: boolean;
  mobileCamera: "front" | "back";
  muted: boolean;
  onMethods: any[];
  roomConnected: boolean;
  screen: boolean;
  screenAudio: boolean;
  serverId: string;
  serverPeerConnectionId: string;
  speakerDeviceId: string | null;
  stringeeClient: StringeeClient;
  userData: any;
  userPublish: string;
  video: boolean;
  videoDeviceId: string | null;

  webrtc: {
    iceServers: unknown;
    localAudioEnabled: boolean;
    localCandidates: any[];
    localConstraints: Record<string, any>;
    localId: string;
    localSdp: any;
    localVideoEnabled: boolean;
    mediaConnected: boolean;
    muted: boolean;
    pc: any;
    remoteStream: any;
    serverId: string;
    stopped: false;
    localStream?: MediaStream;

    changeDevice(e, t);
    enableLocalVideo(e);
    freeResource();
    initPeerConnection(e, t, n, r);
    initPeerConnectionNoAccessDevice(e, t, n);
    mute(e);
    onReceiveCandidate(e);
    onReceiveSdp(e);

    eventHandler: {
      onCandidate(e): void;
      onIceConnectionStateChange(e): void;
      onTrack(e, t): void;
      onTrackEnded(): void;
      onWebRtcClose(): void;
    };
  };

  init(): Promise<StringeeVideoTrack>;
  on(evName: "ready", callback: (deviceTypes: string[]) => unknown): void;
  on(
    evName: "mediastate",
    callback: (mediaState: StringeeMediaState) => unknown
  ): void;
  on(
    evName: "gotDevicesInfo",
    callback: (data: StringeeDevicesInfo) => unknown
  ): void;
  on(
    evName: "changedevice",
    callback: (data: {
      type: "video" | "audio" | "both";
      newDeiceId: string;
      newOptions: StringeePublishOptions;
    }) => unknown
  ): void;
  on(evName: "trackended", callback: (...args: any[]) => unknown);
  attach(): HTMLVideoElement;
  detach(): HTMLVideoElement[];

  changeDevice(
    deviceType: "video" | "audio" | "both",
    deviceId: string | null,
    options?: StringeePublishOptions
  ): Promise<void>;

  buildConstraints(ev): void;
  callOnEvent(evName: string, t): void;
  detachAndRemove(): void;
  disableRemoteAudio(): Promise<unknown>;
  disableRemoteVideo(): Promise<unknown>;
  enableLocalVideo(e: unknown): Promise<unknown>;
  getBW(): Promise<unknown>;
  getMediaStream(): any;
  getStats(callback: (stats: unknown) => unknown): any;
  mute(muted: boolean): Promise<unknown>;
  onCandidateFromServer(callback: (...args: unknown[]) => unknown): void;
  onRemoteStream(e, t): void;
  onSdpFromServer(e): void;
  processSendSdpCandidate(): void;
  routeAudioToSpeaker(speakerId: string): boolean;
  switchCamera(): void;
  close(): void;
}

type StringeeJoinRoomResult = {
  room: StringeeConferenceRoom;
  listTracksInfo: StringeeRemoteTrack[];
  listStringeeClients: Array<{
    id: string;
    user: string;
  }>;
  listUsersInfo: Array<StringeeUserInfo>;
};

declare class StringeeVideo {
  static joinRoom(
    client: StringeeClient,
    roomToken: string
  ): Promise<StringeeJoinRoomResult>;
  static getDevicesInfo(): Promise<StringeeDevicesInfo>;
}

declare class StringeeUtil {
  static isWebRTCSupported(): boolean;
  static version(): {
    version: string;
    build: string;
  };

  static getDevicesInfo(): Promise<StringeeDevicesInfo>;
}

declare class StringeeMessage {
  id: string;
  type: number;
  conversationId: string;
  createdAt: number;
  localId: string;
  sender: string;
  sequence: number;
  state: number;
  content: {
    audio?: {
      duration: number;
      filePath: string;
    };
    contact?: {
      vcard: string;
    };
    file?: {
      filePath: string;
      filename: string;
      length: number;
    };
    location: {
      lat: number;
      lon: number;
    };
    photo?: {
      filePath: string;
      thumbnail: string;
      ratio: string;
    };
    content?: string;
    video?: {
      filePath: string;
      thumbnail: string;
      ratio: string;
      duration: string;
    };
    sticker?: {
      name: string;
      category: string;
    };
    metadata?: Record<string, unknown>;
  };
}

type StringeeChatMessageState = {
  convId: string;
  status: number;
  from: string;
  lastMsgSeq: number;
  lastMsgTimestamp: number;
};

declare module "stringee-chat-js-sdk" {
  type StringeeChatCallback = (
    status: boolean,
    code: number,
    message: string
  ) => unknown;

  class StringeeClient {
    accessToken: string;
    browserId: string;
    deviceId: string;
    disconnectByUser: boolean;
    hasConnected: boolean;
    lastTimeStampReceivedPacket: number;
    sessionId: string;
    socket: {
      alreadyTried: boolean;
      healthCheckInterval: number;
      serverAddr: string;
      userDisconnect: boolean;
      timeoutReconnectMethod: any;
      serverAddressIsDead: boolean;
    };
    stringeeServerAddrIndex: number;
    stringeeServerAddrs: string[];
    tempWebsocketURL: string[];
    timeoutToReconnect: 60000;
    userId: string;

    connect(access_token: string): void;

    on(evName: "connect", callback: () => unknown);
    on(
      evName: "authen",
      callback: (res: StringeeOnAuthenticatedResponse) => unknown
    ): void;
    on(evName: "disconnect", callback: () => unknown): void;
    on(evName: "requestnewtoken", callback: () => unknown): void;
    on(enName: "otherdeviceauthen", callback: (args: any) => unknown): void;
    on(
      enName: "chatmessage",
      callback: (message: StringeeMessage) => unknown
    ): void;
    on(
      enName: "chatmessagestate",
      callback: (message: StringeeChatMessageState) => unknown
    ): void;

    disconnect(): void;
    findCall2ByCallId(id: string): any;
    findCallByCallId(id: string): any;
    getBrowserId(): string;
    getClientId(): string;
    getURLToConnect(): string;
    isActiveClient(): boolean;
    sendCustomMessage(
      userId: string,
      message: Record<string, unknown>,
      callback: (message: string) => unknown
    );
    setThisClientIsActive(isActive: boolean): void;
  }

  type StringeeChatUser = {
    id: string;
    displayName: string;
    avatarUrl: string;
  };
  type StringeeConversationOptions = {
    name?: string;
    imageUrl?: string;
    isDistinct?: boolean;
    isGroup?: boolean;
  };

  type StringeeConversation = StringeeConversationOptions & {
    id: string;
  };

  type StringeeMessagePayload = {
    type?: number;
    convId: string;
    message: {
      audio?: {
        duration: number;
        filePath: string;
      };
      contact?: {
        vcard: string;
      };
      file?: {
        filePath: string;
        filename: string;
        length: number;
      };
      location?: {
        lat: number;
        lon: number;
      };
      photo?: {
        filePath: string;
        thumbnail: string;
        ratio: number;
      };
      content?: string;
      video?: {
        filePath: string;
        thumbnail: string;
        ratio: string;
        duration: string;
      };
      sticker?: {
        name: string;
        category: string;
      };
      metadata?: Record<string, unknown>;
    };
  };

  class StringeeChat {
    constructor(client: StringeeClient);

    client: StringeeClient;
    msgQueue: {
      body: StringeeMessagePayload & {
        localDbId: string;
        requestId: string;
      };
      callback: (status: boolean) => unknown;
      expireTime: number;
      id: string;
      userId: string;
    }[];
    trackingMap: Array<{
      key: string;
      value: StringeeMessage;
    }>;

    on(
      eventName: "onObjectChange",
      callback: (info: {
        objectType: 0 | 1; // 0: Conversation,  1: Message
        changeType: 0 | 1 | 2; // 0: Insert, 1: Update, 2: Delete
        objectChanges: StringeeMessage[];
      }) => unknown
    ): void;
    on(eventName: "pinMsgFromServer", callback: (info: any) => unknown): void;
    on(
      eventName: "revokeMsgFromServer",
      callback: (info: any) => unknown
    ): void;
    on(
      eventName: "removeParticipantFromServer",
      callback: (info: any) => unknown
    ): void;

    sendMessage(
      message: StringeeMessagePayload,
      callback: (
        status: boolean,
        code: number,
        message: string,
        msg: StringeeMessage
      ) => unknown
    ): void;
    getLastMessages(
      conversationId: string,
      count: number,
      isAscending: boolean,
      callback: (
        status: boolean,
        code: number,
        message: string,
        messages: StringeeMessage[]
      ) => unknown
    ): void;
    getMessagesAfter(
      conversationId: string,
      sequence: number,
      count: number,
      isAscending: boolean,
      callback: (
        status: boolean,
        code: number,
        message: string,
        messages: StringeeMessage[]
      ) => unknown
    ): void;
    getMessagesBefore(
      conversationId: string,
      sequence: number,
      count: number,
      isAscending: boolean,
      callback: (
        status: boolean,
        code: number,
        message: string,
        messages: StringeeMessage[]
      ) => unknown
    ): void;
    markConversationAsRead(
      conversationId: string,
      callback: StringeeChatCallback
    ): void;
    deleteMessage(
      conversationId: string,
      messageId: string,
      callback: StringeeChatCallback
    ): void;
    pinMessage(
      conversationId: string,
      messageId: string,
      isPin: boolean,
      callback: StringeeChatCallback
    ): void;
    editMessage(
      conversationId: string,
      messageId: string,
      chatContent: string,
      callback: StringeeChatCallback
    ): void;
    revokeMessage(
      conversationId: string,
      messageId: string,
      callback: StringeeChatCallback
    ): void;
    getUsersInfo(
      userIds: string[],
      callback: (
        status: boolean,
        code: number,
        message: string,
        users: StringeeUserInfo[]
      ) => unknown
    ): void;

    createConversation(
      userIds: string[],
      options: StringeeConversationOptions,
      callback: (
        status: boolean,
        code: number,
        message: string,
        conversation: StringeeConversation
      ) => unknown
    ): void;
    updateConversation(
      conversationId: string,
      callback: StringeeChatCallback
    ): void;
    deleteConversation(
      conversationId: string,
      options: StringeeConversationOptions,
      callback: StringeeChatCallback
    ): void;
    getLastConversations(
      count: number,
      isAscending: boolean,
      callback: (
        status: boolean,
        code: number,
        message: string,
        conversations: StringeeConversation[]
      ) => unknown
    ): void;
    getConversationsAfter(
      dateTime: number,
      count: number,
      isAscending: boolean,
      callback: (
        status: boolean,
        code: number,
        message: string,
        conversations: StringeeConversation[]
      ) => unknown
    ): void;
    getConversationsBefore(
      dateTime: number,
      count: number,
      isAscending: boolean,
      callback: (
        status: boolean,
        code: number,
        message: string,
        conversations: StringeeConversation[]
      ) => unknown
    ): void;
    addParticipants(
      conversationId: string,
      userIds: string[],
      callback: (
        status: boolean,
        code: number,
        message: string,
        added: boolean
      ) => unknown
    ): void;
    removeParticipants(
      conversationId: string,
      userIds: string[],
      callback: (
        status: boolean,
        code: number,
        message: string,
        removed: boolean
      ) => unknown
    ): void;

    blockInviteToGroup: (
      conversationId: string,
      callback: StringeeChatCallback
    ) => void;
    blockUser: (userId: string, callback: (status: boolean) => unknown) => void;
    clearHistory: (
      options: {
        convId: string;
      },
      callback: StringeeChatCallback
    ) => void;
    confirmTransferChat: (
      conversationId: string,
      callback?: () => unknown
    ) => void;
    fireObjectChangeEvent: (e, t, r) => void;
    getChatServices: (conversationId: string) => any;
    getConversationById: (
      conversationId: string,
      callback: (
        status: boolean,
        code: number,
        message: string,
        conversation: StringeeConversation
      ) => unknown
    ) => void;
    getConversationWithUser: (
      userId: string,
      callback: (
        status: boolean,
        code: number,
        message: string,
        conversation: StringeeConversation
      ) => unknown
    ) => void;
    getUnreadConversationCount: (
      callback: (
        status: boolean,
        code: number,
        message: string,
        count: number
      ) => unknown
    ) => void;
    joinChat: (
      conversationId: string,
      callback: (conversationId?: string) => unknown
    ) => void;
    keyForMsg: (message: StringeeMessage) => string;
    loadChatMessages: (
      options: {
        seqGreater?: number;
        limit?: number;
        sort?: string;
        convId: string;
      },
      callback: (options: {
        seqGreater?: number;
        limit?: number;
        sort?: string;
        convId: string;
      }) => unknown
    ) => void;
    markMessageSeen: (
      message: Partial<StringeeMessagePayload>,
      callback: StringeeChatCallback
    ) => void;
    rateChat: (
      conversationId: string,
      rating: number,
      comment: string,
      callback: (conversationId: string) => unknown
    ) => unknown;
    sendEmailTranscript: (
      options: {
        convId: string;
        email: string;
        domain?: string;
      },
      callback: (conversationId: string) => unknown
    ) => unknown;
    sendMessageQueue: () => void;
    trackMsg: (state: StringeeChatMessageState) => void;
    transferChat: (
      conversationId: string,
      customer: {
        customerId: string;
        customerName: string;
        toUserId: string;
      },
      callback: (conversationId: string) => unknown
    ) => void;
    updateUserInfo: (
      name: string,
      email: string,
      avatar: string,
      callback: StringeeChatCallback
    ) => void;
    viewChat: (
      conversationId: string,
      callback: (conversationId: string) => unknown
    ) => void;
  }
}
