import { Dispatch, SetStateAction } from "react";
import { TOAST_PAYLOAD } from "../../toaster/Toast.types";

export interface NOTIFICATION_CONTEXT {
	notifications: USER_NOTIFICATION[];
	setNotifications: Dispatch<SetStateAction<USER_NOTIFICATION[]>>;
	toastNotifications: TOAST_PAYLOAD[];
	setToastNotifications: Dispatch<SetStateAction<TOAST_PAYLOAD[]>>;
	handleRemove: (id: string) => void;
	isLoading: boolean;
	notifLength: number;
	DEFAULT_TIME: number;
}

/************************************************************** */
/************************* UPDATE EVENT *************************/
/************************************************************** */

type NOTIFICATION_SCOPE = "all" | "single";

export interface UPDATE_NOTIFICATION {
	notificationId: number;
	scope: NOTIFICATION_SCOPE;
	status: NOTIFICATION_STATUS;
}

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
}

export type NOTIFICATION_STATUS = "read" | "unread" | "dismissed";

export type NOTIFICATION_TYPE = "chat" | "game" | "friend_request" | "tournament";

/************************************************************** */
/********************** GET HISTORY REQUEST *********************/
/************************************************************** */

export interface HistoryPayload {
	status: "success" | "error";
	message: USER_NOTIFICATION[];
}
