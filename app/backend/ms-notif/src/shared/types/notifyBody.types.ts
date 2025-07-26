type notifType = 'chat' | 'game' | 'friend_request';

// BLOB

interface INotifyBody {
	from_user: string;
	to_user: string;
	avatar: Buffer;
	type: notifType;
	msg?: string;
	action_url?: string;
}

export { notifType };

export default INotifyBody;
