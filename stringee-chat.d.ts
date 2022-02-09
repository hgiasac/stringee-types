declare module "stringee-chat-js-sdk" {
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

    on(evName: "connect", callback: () => void);
    on(
      evName: "authen",
      callback: (res: StringeeOnAuthenticatedResponse) => void
    ): void;
    on(evName: "disconnect", callback: () => void): void;
    on(evName: "requestnewtoken", callback: () => void): void;
    on(enName: "otherdeviceauthen", callback: (args: any) => void): void;
    on(
      enName: "chatmessage",
      callback: (message: StringeeMessage) => void
    ): void;
    on(
      enName: "chatmessagestate",
      callback: (message: StringeeChatMessageState) => void
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
      callback: (message: string) => void
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
      }) => void
    ): void;
    on(eventName: "pinMsgFromServer", callback: (info: any) => void): void;
    on(eventName: "revokeMsgFromServer", callback: (info: any) => void): void;
    on(
      eventName: "removeParticipantFromServer",
      callback: (info: any) => void
    ): void;

    sendMessage(
      message: StringeeMessagePayload,
      callback: (
        status: boolean,
        code: number,
        message: string,
        msg: StringeeMessage
      ) => void
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
      ) => void
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
      ) => void
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
      ) => void
    ): void;
    markConversationAsRead(
      conversationId: string,
      callback: (status: boolean, code: number, message: string) => void
    ): void;
    deleteMessage(
      conversationId: string,
      messageId: string,
      callback: (status: boolean, code: number, message: string) => void
    ): void;
    pinMessage(
      conversationId: string,
      messageId: string,
      isPin: boolean,
      callback: (status: boolean, code: number, message: string) => void
    ): void;
    editMessage(
      conversationId: string,
      messageId: string,
      chatContent: string,
      callback: (status: boolean, code: number, message: string) => void
    ): void;
    revokeMessage(
      conversationId: string,
      messageId: string,
      callback: (status: boolean, code: number, message: string) => void
    ): void;
    getUsersInfo(
      userIds: string[],
      callback: (
        status: boolean,
        code: number,
        message: string,
        users: StringeeUserInfo[]
      ) => void
    ): void;

    createConversation(
      userIds: string[],
      options: StringeeConversationOptions,
      callback: (
        status: boolean,
        code: number,
        message: string,
        conversation: StringeeConversation
      ) => void
    ): void;
    updateConversation(
      conversationId: string,
      callback: (status: boolean, code: number, message: string) => void
    ): void;
    deleteConversation(
      conversationId: string,
      options: StringeeConversationOptions,
      callback: (status: boolean, code: number, message: string) => void
    ): void;
    getLastConversations(
      count: number,
      isAscending: boolean,
      callback: (
        status: boolean,
        code: number,
        message: string,
        conversations: StringeeConversation[]
      ) => void
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
      ) => void
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
      ) => void
    ): void;
    addParticipants(
      conversationId: string,
      userIds: string[],
      callback: (
        status: boolean,
        code: number,
        message: string,
        added: boolean
      ) => void
    ): void;
    removeParticipants(
      conversationId: string,
      userIds: string[],
      callback: (
        status: boolean,
        code: number,
        message: string,
        removed: boolean
      ) => void
    ): void;

    blockInviteToGroup: (
      conversationId: string,
      callback: (status: boolean, code: number, message: string) => void
    ) => void;
    blockUser: (userId: string, callback: (status: boolean) => void) => void;
    clearHistory: (
      options: {
        convId: string;
      },
      callback: (status: boolean, code: number, message: string) => void
    ) => void;
    confirmTransferChat: (
      conversationId: string,
      callback?: () => void
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
      ) => void
    ) => void;
    getConversationWithUser: (
      userId: string,
      callback: (
        status: boolean,
        code: number,
        message: string,
        conversation: StringeeConversation
      ) => void
    ) => void;
    getUnreadConversationCount: (
      callback: (
        status: boolean,
        code: number,
        message: string,
        count: number
      ) => void
    ) => void;
    joinChat: (
      conversationId: string,
      callback: (conversationId?: string) => void
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
      }) => void
    ) => void;
    markMessageSeen: (
      message: Partial<StringeeMessagePayload>,
      callback: (status: boolean, code: number, message: string) => void
    ) => void;
    rateChat: (
      conversationId: string,
      rating: number,
      comment: string,
      callback: (conversationId: string) => void
    ) => void;
    sendEmailTranscript: (
      options: {
        convId: string;
        email: string;
        domain?: string;
      },
      callback: (conversationId: string) => void
    ) => void;
    sendMessageQueue: () => void;
    trackMsg: (state: StringeeChatMessageState) => void;
    transferChat: (
      conversationId: string,
      customer: {
        customerId: string;
        customerName: string;
        toUserId: string;
      },
      callback: (conversationId: string) => void
    ) => void;
    updateUserInfo: (
      name: string,
      email: string,
      avatar: string,
      callback: (status: boolean, code: number, message: string) => void
    ) => void;
    viewChat: (
      conversationId: string,
      callback: (conversationId: string) => void
    ) => void;
  }
}
