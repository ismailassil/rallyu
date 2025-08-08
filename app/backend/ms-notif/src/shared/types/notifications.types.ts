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

export type NOTIFICATION_STATUS = 'read' | 'unread' | 'dismissed';
export type NOTIFICATION_STATE = 'pending' | 'finished';

export type NOTIFICATION_TYPE =
	| 'chat'
	| 'game'
	| 'friend_request'
	| 'tournament'
	| 'status';

type NOTIFICATION_SCOPE = 'all' | 'single';

/**
 * When the user updates the notification
 * like `read` and `dismissed`
 */
export interface UPDATE_NOTIFICATION_PAYLOAD {
	userId: number;
	data: UPDATE_NOTIFICATION_DATA;
}

/**
 * Payload of the `UPDATE_NOTIFICATION_PAYLOAD`
 */
export interface UPDATE_NOTIFICATION_DATA {
	notificationId: number;
	scope: NOTIFICATION_SCOPE;
	status: NOTIFICATION_STATUS;
	state?: NOTIFICATION_STATE;
}

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
