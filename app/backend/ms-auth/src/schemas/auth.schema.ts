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
		loginChallengeID: { type: 'number' },
		method: { type: 'string' }
	},
	required: ['loginChallengeID', 'method'],
	additionalProperties: false
};

const auth2FALoginChallengeVerifyCodeBody = {
	type: 'object',
	properties: {
		loginChallengeID: { type: 'number' },
		method: { type: 'string' },
		code: { type: 'string' }
	},
	required: ['loginChallengeID', 'method', 'code'],
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
const auth2FASetupBody = {
	type: 'object',
	properties: {
		method: { type: 'string' }
	},
	required: ['method']
};

const auth2FASetupVerifyBody = {
	type: 'object',
	properties: {
		code: { type: 'string' }
	},
	required: ['code']
};

const auth2FADisableBody = {
	type: 'object',
	properties: {
		method: { type: 'string' },
		password: { type: 'string' }
	},
	required: ['method', 'password']
};

// Password management
const authResetPasswordBody = {
	type: 'object',
	properties: {
		email: { type: 'string' }
	},
	required: ['email']
};

const authResetPasswordVerifyBody = {
	type: 'object',
	properties: {
		email: { type: 'string' },
		code: { type: 'string' }
	},
	required: ['email', 'code']
};

const authResetPasswordUpdateBody = {
	type: 'object',
	properties: {
		email: { type: 'string' },
		code: { type: 'string' },
		password: { type: 'string' }
	},
	required: ['email', 'code', 'password']
};

const authChangePasswordBody = {
	type: 'object',
	properties: {
		oldPassword: { type: 'string' },
		newPassword: { type: 'string' }
	},
	required: ['oldPassword', 'newPassword']
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
	body: auth2FASetupBody
}

export const auth2FASetupVerifySchema = {
	body: auth2FASetupVerifyBody
}

export const auth2FADisableSchema = {
	body: auth2FADisableBody
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
