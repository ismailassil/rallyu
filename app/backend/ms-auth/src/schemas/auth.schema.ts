const authRegisterBody = {
	type: 'object',
	properties: {
		first_name: { type: 'string' },
		last_name: { type: 'string' },
		username: { type: 'string' },
		email: { type: 'string' },
		password: { type: 'string' }
	},
	required: ['first_name', 'last_name', 'username', 'email', 'password'],
	additionalProperties: false
};

const authLoginBody = {
	type: 'object',
	properties: {
		username: { type: 'string' },
		password: { type: 'string' }
	},
	required: ['username', 'password'],
	additionalProperties: false
};

// const authLogoutBody = {
// 	type: 'object',
// 	properties: {
// 		access_token: { type: 'string' } // access token to blacklist
// 	},
// 	required: ['access_token'],
// 	additionalProperties: false
// }

const authBearerHeader = {
	type: 'object',
	properties: {
		authorization: { type: 'string' } // refresh token to invalidate session / generate new one
	},
	required: ['authorization']
}

const authOAuthQueryString = {
	type: 'object',
	properties: {
		code: { type: 'string' }
	},
	required: ['code']
}

// const auth2FASetupBody = {
// 	type: 'object',
// 	properties: {
// 		method: { type: 'string' },
// 		contact: { type: 'string' }
// 	},
// 	required: ['method', 'contact']
// }

const authMFAVerifyBody = {
	type: 'object',
	properties: {
		code: { type: 'string' }
	},
	required: ['code']
}

// const auth2FADisableBody = {
// 	type: 'object',
// 	properties: {
// 		method: { type: 'string' },
// 		password: { type: 'string' }
// 	},
// 	required: ['method', 'password']
// }

const authResetPasswordBody = {
	type: 'object',
	properties: {
		email: { type: 'string' }
	},
	required: ['email']
}

const authResetPasswordVerifyBody = {
	type: 'object',
	properties: {
		email: { type: 'string' },
		code: { type: 'string' }
	},
	required: ['email', 'code']
}

const authResetPasswordUpdateBody = {
	type: 'object',
	properties: {
		email: { type: 'string' },
		code: { type: 'string' },
		password: { type: 'string' }
	},
	required: ['email', 'code', 'password']
}

export const authRegisterSchema = {
	body: authRegisterBody
};

export const authLoginSchema = {
	body: authLoginBody
};

export const authLogoutSchema = {
	headers: authBearerHeader
}

export const authRefreshSchema = {
	// headers: authBearerHeader
}

export const authOAuthSchema = {
	querystring: authOAuthQueryString
}

// export const auth2FASetupSchema = {
// 	body: auth2FASetupBody
// }

// export const auth2FAConfirmSchema = {
// 	body: auth2FAConfirmBody
// }

// export const auth2FAVerifySchema = {
// 	body: auth2FAConfirmBody
// }

// export const auth2FADisableSchema = {
// 	body: auth2FADisableBody
// }

export const authMFAVerifySchema = {
	body: authMFAVerifyBody
}

export const authResetPasswordSchema = {
	body: authResetPasswordBody
}

export const authResetPasswordVerifySchema = {
	body: authResetPasswordVerifyBody
}

export const authResetPasswordUpdateSchema = {
	body: authResetPasswordUpdateBody
}
