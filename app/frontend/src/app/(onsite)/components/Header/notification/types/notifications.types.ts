import { Dispatch, SetStateAction } from "react";
import { TOAST_PAYLOAD } from "../../toaster/Toast.types";

export interface NOTIFICATION_CONTEXT {
	notifications: USER_NOTIFICATION[];
	setNotifications: Dispatch<SetStateAction<USER_NOTIFICATION[]>>;
	toastNotifications: TOAST_PAYLOAD[];
	setToastNotifications: Dispatch<SetStateAction<TOAST_PAYLOAD[]>>;
	handleRemove: (id: number) => void;
	handleAccept: (type: NOTIFICATION_TYPE, senderId: number, isToast: boolean, notifId: number) => Promise<void>;
	handleDecline: (type: NOTIFICATION_TYPE, senderId: number, isToast: boolean, notifId: number) => Promise<void>;
	isLoading: boolean;
	notifLength: number;
	DEFAULT_TIME: number;
}

/************************************************************** */
/************************* UPDATE EVENT *************************/
/************************************************************** */

export type UPDATE_NOTIFICATION_DATA =
	| {
			updateAll: true;
			status: NOTIFICATION_STATUS;
			state: NOTIFICATION_STATE;
	  }
	| {
			updateAll: false;
			notificationId: number;
			status: NOTIFICATION_STATUS;
			state: NOTIFICATION_STATE;
	  };

/************************************************************** */
/************************* NOTIFY EVENT *************************/
/************************************************************** */

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

export type NOTIFICATION_TYPE = "chat" | "game" | "friend_request" | "tournament" | 'status';

export type NOTIFICATION_STATE = "pending" | 'finished';

/************************************************************** */
/********************** GET HISTORY REQUEST *********************/
/************************************************************** */

export interface HistoryPayload {
	status: "success" | "error";
	message: USER_NOTIFICATION[];
}
