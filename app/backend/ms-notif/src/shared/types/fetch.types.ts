import { statusType } from './notifMessage.types';
import { notifType } from './notifyBody.types';

interface IFetchParams {
	username: string;
}

interface IFetchQuery {
	page: number;
}

interface INotifDetail {
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

interface IUpdateTypes {
	username: string;
	type: 'update';
	data: {
		notifStatus: statusType;
		notifType: (boolean | undefined) | number;
	};
}

interface INotifyTypes {
	username: string;
	type: 'notify';
	data: INotifDetail;
}

export { IFetchParams, IFetchQuery, INotifDetail, IUpdateTypes, INotifyTypes };
