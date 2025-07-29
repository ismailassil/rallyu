import { statusType } from './notifMessage.types';

interface IUpdateBody {
	username: string;
	notificationId: number;
	status: statusType;
	all?: boolean;
}

export default IUpdateBody;
