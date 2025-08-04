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
}

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
}

export interface NOTIFY_USER_PAYLOAD {
	senderId: number;
	receiverId: number;
	type: NOTIFICATION_TYPE;
	message?: string;
	actionUrl?: string;
}

export type NOTIFICATION_STATUS = 'read' | 'unread' | 'dismissed';

export type NOTIFICATION_TYPE = 'chat' | 'game' | 'friend_request' | 'tournament';
