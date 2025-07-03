import { statusType } from './notifMessage.types';

interface IFetchParams {
	username: string;
}

interface IFetchQuery {
	page: number;
}

interface IFetchResponse {
	id: number;
	from_user: string;
	to_user: string;
	message: string;
	type: 'chat' | 'game' | 'friend_request';
	created_at: string;
	updated_at: string;
	status: statusType;
	action_url: string;
}

export { IFetchParams, IFetchQuery, IFetchResponse };
