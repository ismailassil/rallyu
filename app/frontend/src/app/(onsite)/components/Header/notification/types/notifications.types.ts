/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction } from "react";
import { TOAST_PAYLOAD } from "../../toaster/Toast.types";

export type NOTIFICATION_STATUS = "read" | "unread" | "dismissed";
export type NOTIFICATION_STATE = "pending" | "finished";
export type NOTIFICATION_TYPE =
	| "chat"
	| "game"
	| "pp_game"
	| "xo_game"
	| "friend_request"
	| "tournament"
	| "friend_accept"
	| "friend_reject"
	| "friend_cancel"
	| "game_accept"
	| "game_reject";

export interface NotificationContext {
	notifications: Notification[];
	setNotifications: Dispatch<SetStateAction<Notification[]>>;
	toastNotifications: TOAST_PAYLOAD[];
	setToastNotifications: Dispatch<SetStateAction<TOAST_PAYLOAD[]>>;
	handleRemoveToast: (id: number) => void;
	handleAccept: (data: Notification | TOAST_PAYLOAD, isToast: boolean) => Promise<void>;
	handleDecline: (data: Notification | TOAST_PAYLOAD, isToast: boolean) => Promise<void>;
	isLoading: boolean;
	notifLength: number;
	DEFAULT_TIME: number;
}

enum NOTIF_TYPE {
	NOTIFY = "NOTIFY",
	UPDATE_ACTION = "UPDATE_ACTION",
	UPDATE_ALL = "UPDATE_ALL",
	UPDATE_CONTEXT = "UPDATE_CONTEXT",
	UPDATE_GAME = "UPDATE_GAME",
}

export interface ServerToClient {
	eventType: `${NOTIF_TYPE}`;
	data: any;
}

// /************************************************************** */
// /************************* UPDATE EVENT *************************/
// /************************************************************** */

export type UpdateNotification =
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

export type UpdateContext = {
	type: NOTIFICATION_TYPE;
	status: NOTIFICATION_STATUS;
	state: NOTIFICATION_STATE;
};

export type UpdateAll = {
	senderId: number;
	type: NOTIFICATION_TYPE;
	status: NOTIFICATION_STATUS;
};

// /************************************************************** */
// /************************* NOTIFY EVENT *************************/
// /************************************************************** */

export interface Notification {
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

// /************************************************************** */
// /********************** GET HISTORY REQUEST *********************/
// /************************************************************** */

export interface HistoryPayload {
	status: "success" | "error";
	message: Notification[];
}
