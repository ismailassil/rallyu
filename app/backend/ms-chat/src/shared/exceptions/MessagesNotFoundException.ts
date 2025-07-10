class MessagesNotFoundException extends Error {
	constructor(message?: string) {
		super(message || 'Messages Not Found');
		this.name = 'Messages Not Found Exception';
	}
}

export default MessagesNotFoundException;
