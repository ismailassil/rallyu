/* ---------------- Body Schemas ---------------- */

// Local Auth
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

// 2FA login challenge
const auth2FALoginChallengeBody = {
	type: 'object',
	properties: {
		token: { type: 'string' },
		method: {
			type: 'string',
			enum: ['EMAIL', 'SMS', 'TOTP']
		}
	},
	required: ['token', 'method'],
	additionalProperties: false
};

const auth2FALoginChallengeVerifyCodeBody = {
	type: 'object',
	properties: {
		token: { type: 'string' },
		code: { type: 'string' }
	},
	required: ['token', 'code'],
	additionalProperties: false
};

// const authBearerHeader = {
// 	type: 'object',
// 	properties: {
// 		authorization: { type: 'string' }
// 	},
// 	required: ['authorization']
// };

// const authOAuthQueryString = {
// 	type: 'object',
// 	properties: {
// 		code: { type: 'string' }
// 	},
// 	required: ['code']
// };

// 2FA management
const auth2FAMethodInQuery = {
	type: 'object',
	properties: {
		method: {
			type: 'string',
			enum: ['EMAIL', 'SMS', 'TOTP']
		}
	},
	required: ['method']
};
const auth2FAMethodInParams = {
	type: 'object',
	properties: {
		method: {
			type: 'string',
			enum: ['EMAIL', 'SMS', 'TOTP']
		}
	},
	required: ['method']
};

const authChallengeTokenInBody = {
	type: 'object',
	properties: {
		token: {
			type: 'string'
		}
	},
	required: ['token']
};

const authVerifyChallengeBody = {
	type: 'object',
	properties: {
		token: { type: 'string'},
		code: { type: 'string' }
	},
	required: ['token', 'code'],
	additionalProperties: false
};

// Password management
const authResetPasswordBody = {
	type: 'object',
	properties: {
		email: { type: 'string' }
	},
	required: ['email'],
	additionalProperties: false
};

const authResetPasswordUpdateBody = {
	type: 'object',
	properties: {
		token: { type: 'string' },
		newPassword: { type: 'string' }
	},
	required: ['token', 'newPassword'],
	additionalProperties: false
};

const authChangePasswordBody = {
	type: 'object',
	properties: {
		oldPassword: { type: 'string' },
		newPassword: { type: 'string' }
	},
	required: ['oldPassword', 'newPassword'],
	additionalProperties: false
};



/* ---------------- Querystring Schemas ---------------- */

const authOAuthQueryString = {
	type: 'object',
	properties: {
		code: { type: 'string' }
	},
	required: ['code']
};

export const authRegisterSchema = {
	body: authRegisterBody
};

export const authLoginSchema = {
	body: authLoginBody
};

export const auth2FALoginChallengeSchema = {
	body: auth2FALoginChallengeBody
};

export const auth2FALoginChallengeVerifyCodeSchema = {
	body: auth2FALoginChallengeVerifyCodeBody
};

export const authChangePasswordSchema = {
	body: authChangePasswordBody
};

export const authOAuthSchema = {
	querystring: authOAuthQueryString
}

export const auth2FASetupSchema = {
	querystring: auth2FAMethodInQuery
}

export const auth2FADisableSchema = {
	params: auth2FAMethodInParams
}

export const auth2FAVerifySchema = {
	body: authVerifyChallengeBody
}

export const authResetPasswordSchema = {
	body: authResetPasswordBody
}

export const authResetPasswordVerifySchema = {
	body: authVerifyChallengeBody
}

export const authResetPasswordUpdateSchema = {
	body: authResetPasswordUpdateBody
}

export const authChallengeResendSchema = {
	body: authChallengeTokenInBody
}
