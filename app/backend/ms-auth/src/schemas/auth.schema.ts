const register = {
	body: {
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
	}
}

const login = {
	body: {
		type: 'object',
		properties: {
			username: { type: 'string' },
			password: { type: 'string' }
		},
		required: ['username', 'password'],
		additionalProperties: false
	}
}

const login2faselect = {
	body: {
		type: 'object',
		properties: {
			token: { type: 'string' },
			method: { type: 'string', enum: ['EMAIL', 'SMS', 'TOTP'] }
		},
		required: ['token', 'method'],
		additionalProperties: false
	}
}

const login2faverify = {
	body: {
		type: 'object',
		properties: {
			token: { type: 'string' },
			code: { type: 'string' }
		},
		required: ['token', 'code'],
		additionalProperties: false
	}
}

const login2faresend = {
	body: {
		type: 'object',
		properties: {
			token: { type: 'string' }
		},
		required: ['token'],
		additionalProperties: false
	}
}

const _2faenabledpost = {
	params: {
		type: 'object',
		properties: {
			method: { type: 'string', enum: ['EMAIL', 'SMS'] }
		},
		required: ['method'],
		additionalProperties: false
	}
}

const _2faenableddelete = {
	params: {
		type: 'object',
		properties: {
			method: { type: 'string', enum: ['EMAIL', 'SMS', 'TOTP'] }
		},
		required: ['method'],
		additionalProperties: false
	}
}

const _2fasetuptotp = {}
const _2fasetuptotpverify = {
	body: {
		type: 'object',
		properties: {
			token: { type: 'string' },
			code: { type: 'string' }
		},
		required: ['token', 'code'],
		additionalProperties: false
	}
}

const changepassword = {
	body: {
		type: 'object',
		properties: {
			oldPassword: { type: 'string' },
			newPassword: { type: 'string' }
		},
		required: ['oldPassword', 'newPassword'],
		additionalProperties: false
	}
}

const resetpassword = {
	body: {
		type: 'object',
		properties: {
			email: { type: 'string' }
		},
		required: ['email'],
		additionalProperties: false
	}
}

const resetpasswordverify = {
	body: {
		type: 'object',
		properties: {
			token: { type: 'string' },
			code: { type: 'string' }
		},
		required: ['token', 'code'],
		additionalProperties: false
	}
}

const resetpasswordresend = {
	body: {
		type: 'object',
		properties: {
			token: { type: 'string' }
		},
		required: ['token'],
		additionalProperties: false
	}
}

const resetpasswordupdate = {
	body: {
		type: 'object',
		properties: {
			token: { type: 'string' }
		},
		required: ['token'],
		additionalProperties: false
	}
}

const sessioniddelete = {
	params: {
		type: 'object',
		properties: {
			session_id: { type: 'string' }
		},
		required: ['session_id'],
		additionalProperties: false
	}
}

const verifycontact = {
	params: {
		type: 'object',
		properties: {
			contact: { type: 'string', enum: ['email', 'phone'] }
		},
		required: ['contact'],
		additionalProperties: false
	}
}

const verifycontactverify = {
	params: {
		type: 'object',
		properties: {
			contact: { type: 'string', enum: ['email', 'phone'] }
		},
		required: ['contact'],
		additionalProperties: false
	},
	body: {
		type: 'object',
		properties: {
			token: { type: 'string' },
			code: { type: 'string' }
		},
		required: ['token', 'code'],
		additionalProperties: false
	}
}

const verifycontactresend = {
	params: {
		type: 'object',
		properties: {
			contact: { type: 'string', enum: ['email', 'phone'] }
		},
		required: ['contact'],
		additionalProperties: false
	},
	body: {
		type: 'object',
		properties: {
			token: { type: 'string' }
		},
		required: ['token'],
		additionalProperties: false
	}
}


export const authRoutesSchemas = {
	core: {
		register: register,
		login: login,
	},
	twoFactor: {
		login: {
			select: login2faselect,
			verify: login2faverify,
			resend: login2faresend
		},
		setup: {
			totp: {
				request: _2fasetuptotp,
				verify: _2fasetuptotpverify
			}
		},
		manage: {
			enable: _2faenabledpost,
			disable: _2faenableddelete
		}
	},
	password: {
		change: changepassword,
		reset: {
			request: resetpassword,
			verify: resetpasswordverify,
			resend: resetpasswordresend,
			update: resetpasswordupdate
		}
	},
	session: {
		delete: sessioniddelete
	},
	verifyContact: {
		request: verifycontact,
		verify: verifycontactverify,
		resend: verifycontactresend
	}
};
