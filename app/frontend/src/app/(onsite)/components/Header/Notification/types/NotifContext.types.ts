import { Dispatch, SetStateAction } from "react";
import { ToastType } from "./Toaster.types";

export interface NotifContextTypes {
	notifications: NotificationPayload[];
	setNotifications: Dispatch<SetStateAction<NotificationPayload[]>>;
	toastNotifications: ToastType[];
	setToastNotifications: Dispatch<SetStateAction<ToastType[]>>;
	handleRemove: (id: string) => void;
	isLoading: boolean;
	notifLength: number;
	DEFAULT_TIME: number;
}

/************************************************************** */
/************************* UPDATE EVENT *************************/
/************************************************************** */

type NotificationUpdateScope = 'all' | 'single';

type StatusType = 'read' | 'unread' | 'dismissed';

export interface UpdateNotificationPayload {
	userId: number;
	notificationId: number;
	scope: NotificationUpdateScope;
	status: StatusType;
}

/************************************************************** */
/************************* NOTIFY EVENT *************************/
/************************************************************** */

type NotificationType = 'chat' | 'game' | 'friend_request';

export interface NotificationPayload {
	id: number;
	senderUsername: string;
	content: string;
	type: NotificationType;
	createdAt: string;
	updatedAt: string;
	status: StatusType;
	actionUrl: string | null;
	avatar: Buffer;
}

export interface HistoryPayload {
	status: 'success' | 'error';
	message: NotificationPayload[];
}
