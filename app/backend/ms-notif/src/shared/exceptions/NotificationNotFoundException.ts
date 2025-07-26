export class NotificationNotFoundException extends Error {
	constructor(message: string = 'Notification Not Found') {
		super(message);
		this.name = 'NotificationNotFoundException';
	}
}
