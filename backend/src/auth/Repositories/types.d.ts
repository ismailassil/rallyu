interface userJWT {
	id: number;
	sessionId: string;
	username: string;
	role: string;
}

interface signUpType {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	password: string;
}

interface TokenType {
	id: number;
	user_id: number;
	token: string;
	device_info: string;
}

export { userJWT, signUpType, TokenType };
