/************************************************************** */
/*********************** UPDATE ON TYPE *************************/
/************************************************************** */

export interface UPDATE_ON_TYPE_DATA {
	type: NOTIFICATION_TYPE;
	state: NOTIFICATION_STATE;
	status: NOTIFICATION_STATUS;
}

export interface UPDATE_ON_TYPE_PAYLOAD {
	userId: number;
	data: UPDATE_ON_TYPE_DATA;
}

/************************************************************** */
/************************* UPDATE EVENT *************************/
/************************************************************** */

type NOTIFICATION_STATE = "pending" | "finished";

export interface UPDATE_ACTION_PAYLOAD {
	userId: number;
	data: UPDATE_NOTIFICATION_DATA;
}

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

export type NOTIFICATION_STATUS = "read" | "unread" | "dismissed";

export type NOTIFICATION_TYPE = "chat" | "game" | "friend_request" | "tournament";

/************************************************************** */
/*********************** UPDATE GAME EVENT **********************/
/************************************************************** */
export interface USER_INFO {
	userId: number;
	userSocket?: string | undefined;
}

export interface UPDATE_GAME_DATA {
	senderId: number;
	receiverId: number;
	stateAction?: "accept" | "decline";
	status: NOTIFICATION_STATUS,
	actionUrl?: string;
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