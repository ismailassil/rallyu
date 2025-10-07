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

export type NOTIFICATION_TYPE = "chat" | "game" | "friend_request" | "tournament" | "status";

/**
 * When the user interacts with the notification to update it
 *
 * Used when **all** or **single** notification are updated
 *
 * `read` | `dismissed`, `pending` | `finished`
 */
export interface UPDATE_ACTION_PAYLOAD {
	userId: number;
	data: UPDATE_NOTIFICATION_DATA;
}

/**
 * Payload of the `UPDATE_ACTION_PAYLOAD`
 */
export type UPDATE_NOTIFICATION_DATA =
	| {
			updateAll: true;
			status: NOTIFICATION_STATUS;
			state?: NOTIFICATION_STATE;
	  }
	| {
			updateAll: false;
			notificationId: number;
			status: NOTIFICATION_STATUS;
			state?: NOTIFICATION_STATE;
	  };

/**
 * Update the status of a notification.
 *
 * Used by other microservices
 *
 * @param actionUrl (target: `game` | `tournament`) used to identify (duplicates)
 */
export interface UPDATE_STATUS_PAYLOAD {
	senderId: number;
	receiverId: number;
	status: NOTIFICATION_STATUS;
	type: NOTIFICATION_TYPE;
	message?: string;
	actionUrl?: string;
}

/**
 * When the enter the chat route
 * update all chat msg to be finished
 */
export interface UPDATE_ON_TYPE_DATA {
	type: NOTIFICATION_TYPE;
	state: NOTIFICATION_STATE;
	status: NOTIFICATION_STATUS;
}

export interface UPDATE_ON_TYPE_PAYLOAD {
	userId: number;
	data: UPDATE_ON_TYPE_DATA;
}

export interface USER_INFO {
	userId: number;
	userSocket?: string | undefined;
}

export interface UPDATE_GAME_PAYLOAD {
	sender: USER_INFO;
	receiver: USER_INFO;
	status: NOTIFICATION_STATUS;
	type: NOTIFICATION_TYPE;
	stateAction?: "accept" | "decline";
	message?: string;
	actionUrl?: string;
}
