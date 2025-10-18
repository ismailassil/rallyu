/**
 * [NATS] Gateway Subject
 */
export interface IncomingGatewayType {
	userId: number;
	userSocket: string;
	load: { eventType: string; data: any };
}

export interface OutgoingGatewayType {
	sockets?: string[];
	userId: number;
	load: any;
}
/**
 * Type of the Database
 */
export interface RAW_NOTIFICATION {
	id: number;
	sender_id: number;
	sender_username: string;
	receiver_id: number;
	content: string;
	type: NOTIFICATION_TYPE;
	created_at: string;
	updated_at: string;
	status: NOTIFICATION_STATUS;
	action_url: string | null;
	state: NOTIFICATION_STATE;
}

/**
 * What user gets
 */
export interface USER_NOTIFICATION {
	id: number;
	senderId: number;
	senderUsername: string;
	receiverId: number;
	content: string;
	type: NOTIFICATION_TYPE;
	createdAt: string;
	updatedAt: string;
	status: NOTIFICATION_STATUS;
	actionUrl: string | null;
	avatar: string;
	state: NOTIFICATION_STATE;
}

/**
 * Notify users
 *
 * Used between microservices
 */
export interface NOTIFY_USER_PAYLOAD {
	senderId: number;
	receiverId: number;
	type: NOTIFICATION_TYPE;
	message?: string;
	actionUrl?: string;
}

export type NOTIFICATION_STATUS = "read" | "unread" | "dismissed";
export type NOTIFICATION_STATE = "pending" | "finished";
export type GAME_TYPE = "pingpong" | "tictactoe";
export type NOTIFICATION_TYPE =
	| "chat"
	| "pp_game"
	| "xo_game"
	| "friend_request"
	| "tournament"
	| "friend_accept"
	| "friend_reject"
	| "friend_cancel"
	| "game_accept"
	| "game_reject";

/**
 * Payload of the `UPDATE_ACTION_PAYLOAD`
 */
export type UPDATE_NOTIFICATION_DATA =
	| {
			updateAll: true;
			status: NOTIFICATION_STATUS;
	  }
	| {
			updateAll: false;
			notificationId: number;
			status: NOTIFICATION_STATUS;
			state: NOTIFICATION_STATE;
	  };

/**
 * Update the status of a notification.
 *
 * Used by other microservices
 *
 */
export interface MICRO_ACTION_PAYLOAD {
	senderId: number;
	receiverId: number;
	load:
		| {
				type: "friend_request";
				status: "accept" | "reject" | "cancel";
		  }
		| {
				type: "tournament";
		  };
}

export interface UPDATE_CONTEXT_DATA {
	type: NOTIFICATION_TYPE;
}

export interface USER_INFO {
	userId: number;
	userSocket?: string | undefined;
}

export interface UpdateGamePayload {
	receiverId: number;
	type: NOTIFICATION_TYPE;
	actionUrl: string;
}

export interface CreateGamePayload {
	targetId: number;
	type: NOTIFICATION_TYPE;
}
