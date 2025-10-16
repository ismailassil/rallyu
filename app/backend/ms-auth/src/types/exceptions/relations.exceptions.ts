import AuthError from "./AAuthError";

export class CannotSendFriendRequestError extends AuthError {
	constructor(message: string = 'Unable to send friend request', details: any = {}) {
		super(message, 400, 'AUTH_CANNOT_SEND_FRIEND_REQUEST', details);
	}
}

export class FriendRequestAlreadySentError extends AuthError {
	constructor(message: string = 'Friend request already sent', details: any = {}) {
		super(message, 400, 'AUTH_FRIEND_REQUEST_ALREADY_SENT', details);
	}
}

export class AlreadyFriendsError extends AuthError {
	constructor(message: string = 'Users are already friends', details: any = {}) {
		super(message, 400, 'AUTH_ALREADY_FRIENDS', details);
	}
}

export class NoPendingRequestError extends AuthError {
	constructor(message: string = 'No pending request', details: any = {}) {
		super(message, 400, 'AUTH_NO_PENDING_REQUEST', details);
	}
}

export class CannotCancelRequestError extends AuthError {
	constructor(message: string = 'Cannot cancel request', details: any = {}) {
		super(message, 400, 'AUTH_CANNOT_CANCEL_REQUEST', details);
	}
}

export class CannotAcceptRequestError extends AuthError {
	constructor(message: string = 'Cannot accept request', details: any = {}) {
		super(message, 400, 'AUTH_CANNOT_ACCEPT_REQUEST', details);
	}
}

export class CannotRejectRequestError extends AuthError {
	constructor(message: string = 'Cannot reject request', details: any = {}) {
		super(message, 400, 'AUTH_CANNOT_REJECT_REQUEST', details);
	}
}

export class CannotBlockError extends AuthError {
	constructor(message: string = 'Unable to block user', details: any = {}) {
		super(message, 400, 'AUTH_CANNOT_BLOCK', details);
	}
}

export class CannotUnblockError extends AuthError {
	constructor(message: string = 'Unable to unblock user', details: any = {}) {
		super(message, 400, 'AUTH_CANNOT_UNBLOCK', details);
	}
}

export class CannotUnfriendError extends AuthError {
	constructor(message: string = 'Unable to unfriend user', details: any = {}) {
		super(message, 400, 'AUTH_CANNOT_UNFRIEND', details);
	}
}
