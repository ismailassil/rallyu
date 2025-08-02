import { NOTIFICATION_STATUS, NOTIFICATION_TYPE } from "./notifications.types";

type NOTIFICATION_SCOPE = 'all' | 'single';

export interface UPDATE_NOTIFICATION {
	notificationId: number;
	scope: NOTIFICATION_SCOPE;
	status: NOTIFICATION_STATUS;
}

export interface IFetchQuery {
	page: number;
}
