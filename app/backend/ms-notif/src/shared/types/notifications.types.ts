export type StatusType = 'read' | 'unread' | 'dismissed';

export interface NotificationDetail {
	id: number;
	senderId: number;
	senderUsername: string;
	recipientId: number;
	recipientUsername: string;
	content: string;
	type: NotificationType;
	createdAt: string;
	updatedAt: string;
	status: StatusType;
	actionUrl: string | null;
}

export interface ClientNotification {
	id: number;
	senderUsername: string;
	recipientUsername: string;
	content: string;
	type: NotificationType;
	createdAt: string;
	updatedAt: string;
	status: StatusType;
	actionUrl: string | null;
	avatar: Buffer;
}

export type NotificationType = 'chat' | 'game' | 'friend_request';

interface NotificationPayload {
	senderId: number;
	recipientId: number;
	type: NotificationType;
	message?: string;
	actionUrl?: string;
}

export default NotificationPayload;
