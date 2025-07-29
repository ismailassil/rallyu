export class UserNotFoundException extends Error {
	constructor(message: string = 'User Not Found') {
		super(message);
		this.name = 'UserNotFoundException';
	}
}
