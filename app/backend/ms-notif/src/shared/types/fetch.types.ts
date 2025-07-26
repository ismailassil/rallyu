import { statusType } from './notifMessage.types';
import { notifType } from './notifyBody.types';

export interface IFetchQuery {
	page: number;
}

export interface INotifDetail {
	id: number;
	from_user: string;
	to_user: string;
	message: string;
	type: notifType;
	created_at: string;
	updated_at: string;
	status: statusType;
	action_url: string;
}

export interface IUpdateTypes {
	username: string;
	type: 'update';
	data: {
		notifStatus: statusType;
		notifType: (boolean | undefined) | number;
	};
}

export interface INotifyTypes {
	username: string;
	type: 'notify';
	data: INotifDetail;
}
