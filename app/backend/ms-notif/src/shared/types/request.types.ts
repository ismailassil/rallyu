import { StatusType } from './notifications.types';

type NotificationUpdateScope = 'all' | 'single';

export interface NotificationUpdate {
	notificationId: number;
	scope: NotificationUpdateScope;
	status: StatusType;
}

export interface IFetchQuery {
	page: number;
}
