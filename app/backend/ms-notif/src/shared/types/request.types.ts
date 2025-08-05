import { NOTIFICATION_STATUS, NOTIFICATION_TYPE } from './notifications.types';

type NOTIFICATION_SCOPE = 'all' | 'single';

export interface UPDATE_NOTIFICATION_PAYLOAD {
	userId: number;
	data: UPDATE_NOTIFICATION_DATA;
}

export interface UPDATE_NOTIFICATION_DATA {
	notificationId: number;
	scope: NOTIFICATION_SCOPE;
	status: NOTIFICATION_STATUS;
}

export interface IFetchQuery {
	page: number;
}
