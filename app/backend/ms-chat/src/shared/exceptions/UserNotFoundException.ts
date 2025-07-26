class UserNotFoundException extends Error {
	constructor(message?: string) {
		super(message || 'User Not Found');
		this.name = 'User Not Found Exception';
	}
}

export default UserNotFoundException;