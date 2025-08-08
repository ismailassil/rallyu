/************************************************************** */
/************************* UPDATE EVENT *************************/
/************************************************************** */

type NOTIFICATION_SCOPE = 'all' | 'single';
type NOTIFICATION_STATE = 'pending' | 'finished';

export interface UPDATE_NOTIFICATION_PAYLOAD {
	userId: number;
	data: UPDATE_NOTIFICATION_DATA;
}

export interface UPDATE_NOTIFICATION_DATA {
	notificationId: number;
	scope: NOTIFICATION_SCOPE;
	status: NOTIFICATION_STATUS;
	state?: NOTIFICATION_STATE;
}

/************************************************************** */
/************************* NOTIFY EVENT *************************/
/************************************************************** */

export interface USER_NOTIFICATION_PAYLOAD {
	userId: number;
	data: USER_NOTIFICATION;
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
	state: NOTIFICATION_STATE;
}

export type NOTIFICATION_STATUS = 'read' | 'unread' | 'dismissed';

export type NOTIFICATION_TYPE = 'chat' | 'game' | 'friend_request' | 'tournament';
