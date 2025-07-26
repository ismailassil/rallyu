interface INotifMessage {
	id: number;
	from_user_id: string | number;
	from_user: string;
	to_user_id: string | number;
	to_user: string;
	message: string;
	type: notifType;
	created_at: string;
	updated_at: string;
	status: statusType;
	action_url: string;
}

interface IMessage {
	username: string;
}

type statusType = 'read' | 'unread' | 'dismissed';

type notifType = 'chat' | 'game' | 'friend_request';

export { IMessage, statusType };

export default INotifMessage;
