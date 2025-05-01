interface userJWT {
	id: number;
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

export { userJWT, signUpType };
