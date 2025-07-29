import { Dispatch, SetStateAction } from "react";
import { NotifType, statusType } from "./NotificationCard.types";
import { ToastType } from "./Toaster.types";

export interface NotifContextTypes {
	notifications: NotificationType[];
	setNotifications: Dispatch<SetStateAction<NotificationType[]>>;
	toastNotifications: ToastType[];
	setToastNotifications: Dispatch<SetStateAction<ToastType[]>>;
	handleRemove: (id: string) => void;
	isLoading: boolean;
	notifLength: number;
	DEFAULT_TIME: number;
}

export interface NotificationType {
	id: number;
	from_user: string;
	to_user: string;
	message: string;
	type: NotifType;
	created_at: string;
	updated_at: string;
	status: statusType;
	action_url: string;
}

export interface IUpdateTypes {
	notifStatus: statusType;
	notifType: (boolean | undefined) | number;
}

export interface HistoryType {
	status: "success" | "error";
	message: NotificationType[];
}
