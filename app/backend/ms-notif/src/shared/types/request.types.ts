import type { NOTIFICATION_STATUS } from "./notifications.types.js";

type NOTIFICATION_SCOPE = 'all' | 'single';

export interface UPDATE_NOTIFICATION {
	notificationId: number;
	scope: NOTIFICATION_SCOPE;
	status: NOTIFICATION_STATUS;
}

export interface IFetchQuery {
	page: number;
}

export interface NOTIFY_GAME_BODY {
	receiver_id: number;
}
