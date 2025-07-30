type NotificationUpdateScope = 'all' | 'single';

type StatusType = 'read' | 'unread' | 'dismissed';

export interface UpdateNotificationPayload {
	userId: number;
	notificationId: number;
	scope: NotificationUpdateScope;
	status: StatusType;
}

type NotificationType = 'chat' | 'game' | 'friend_request';

export interface NotificationPayload {
	senderId: number;
	recipientId: number;
	type: NotificationType;
	message?: string;
	actionUrl?: string;
}
