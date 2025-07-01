type notifType = 'chat' | 'game' | 'friend_request';

interface INotifyBody {
	from_user: string;
	to_user: string;
	type: notifType;
	msg?: string;
	action_url?: string;
}
export { notifType };

export default INotifyBody;
