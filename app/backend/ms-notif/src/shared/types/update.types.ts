interface IUpdateBody {
	username: string;
	notificationId: number;
	status: 'read' | 'dismissed';
	all?: boolean;
}

export default IUpdateBody;
