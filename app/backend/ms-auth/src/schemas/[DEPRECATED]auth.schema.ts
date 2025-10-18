// /* ---------------- Body Schemas ---------------- */

// // Local Auth
// const authRegisterBody = {
// 	type: 'object',
// 	properties: {
// 		first_name: { type: 'string' },
// 		last_name: { type: 'string' },
// 		username: { type: 'string' },
// 		email: { type: 'string' },
// 		password: { type: 'string' }
// 	},
// 	required: ['first_name', 'last_name', 'username', 'email', 'password'],
// 	additionalProperties: false
// };

// const authLoginBody = {
// 	type: 'object',
// 	properties: {
// 		username: { type: 'string' },
// 		password: { type: 'string' }
// 	},
// 	required: ['username', 'password'],
// 	additionalProperties: false
// };


// // const authLogoutBody = {
// // 	type: 'object',
// // 	properties: {
// // 		access_token: { type: 'string' } // access token to blacklist
// // 	},
// // 	required: ['access_token'],
// // 	additionalProperties: false
// // }

// // 2FA login challenge
// const auth2FALoginChallengeBody = {
// 	type: 'object',
// 	properties: {
// 		token: { type: 'string' },
// 		method: {
// 			type: 'string',
// 			enum: ['EMAIL', 'SMS', 'TOTP']
// 		}
// 	},
// 	required: ['token', 'method'],
// 	additionalProperties: false
// };

// const auth2FALoginChallengeVerifyCodeBody = {
// 	type: 'object',
// 	properties: {
// 		token: { type: 'string' },
// 		code: { type: 'string' }
// 	},
// 	required: ['token', 'code'],
// 	additionalProperties: false
// };

// // const authBearerHeader = {
// // 	type: 'object',
// // 	properties: {
// // 		authorization: { type: 'string' }
// // 	},
// // 	required: ['authorization']
// // };

// // const authOAuthQueryString = {
// // 	type: 'object',
// // 	properties: {
// // 		code: { type: 'string' }
// // 	},
// // 	required: ['code']
// // };

// // 2FA management
// const auth2FAMethodInQuery = {
// 	type: 'object',
// 	properties: {
// 		method: {
// 			type: 'string',
// 			enum: ['EMAIL', 'SMS', 'TOTP']
// 		}
// 	},
// 	required: ['method']
// };
// const auth2FAMethodInParams = {
// 	type: 'object',
// 	properties: {
// 		method: {
// 			type: 'string',
// 			enum: ['EMAIL', 'SMS', 'TOTP']
// 		}
// 	},
// 	required: ['method']
// };

// const authChallengeTokenInBody = {
// 	type: 'object',
// 	properties: {
// 		token: {
// 			type: 'string'
// 		}
// 	},
// 	required: ['token']
// };

// const authVerifyChallengeBody = {
// 	type: 'object',
// 	properties: {
// 		token: { type: 'string'},
// 		code: { type: 'string' }
// 	},
// 	required: ['token', 'code'],
// 	additionalProperties: false
// };

// // Password management
// const authResetPasswordBody = {
// 	type: 'object',
// 	properties: {
// 		email: { type: 'string' }
// 	},
// 	required: ['email'],
// 	additionalProperties: false
// };

// const authResetPasswordUpdateBody = {
// 	type: 'object',
// 	properties: {
// 		token: { type: 'string' },
// 		newPassword: { type: 'string' }
// 	},
// 	required: ['token', 'newPassword'],
// 	additionalProperties: false
// };

// const authChangePasswordBody = {
// 	type: 'object',
// 	properties: {
// 		oldPassword: { type: 'string' },
// 		newPassword: { type: 'string' }
// 	},
// 	required: ['oldPassword', 'newPassword'],
// 	additionalProperties: false
// };


// // Verify email/phone



// /* ---------------- Querystring Schemas ---------------- */

// const authOAuthQueryString = {
// 	type: 'object',
// 	properties: {
// 		code: { type: 'string' }
// 	},
// 	required: ['code']
// };

// export const authRegisterSchema = {
// 	body: authRegisterBody
// };

// export const authLoginSchema = {
// 	body: authLoginBody
// };

// export const auth2FALoginChallengeSchema = {
// 	body: auth2FALoginChallengeBody
// };

// export const auth2FALoginChallengeVerifyCodeSchema = {
// 	body: auth2FALoginChallengeVerifyCodeBody
// };

// export const authChangePasswordSchema = {
// 	body: authChangePasswordBody
// };

// export const authOAuthSchema = {
// 	querystring: authOAuthQueryString
// }

// export const auth2FASetupSchema = {
// 	querystring: auth2FAMethodInQuery
// }

// export const auth2FADisableSchema = {
// 	params: auth2FAMethodInParams
// }

// export const auth2FAVerifySchema = {
// 	body: authVerifyChallengeBody
// }

// export const authResetPasswordSchema = {
// 	body: authResetPasswordBody
// }

// export const authResetPasswordVerifySchema = {
// 	body: authVerifyChallengeBody
// }

// export const authResetPasswordUpdateSchema = {
// 	body: authResetPasswordUpdateBody
// }

// export const authChallengeResendSchema = {
// 	body: authChallengeTokenInBody
// }


// export const login2faselect = {
// 	body: {
// 		type: 'object',
// 		properties: {
// 			token: { type: 'string' },
// 			method: { type: 'string', enum: ['EMAIL', 'SMS', 'TOTP'] }
// 		},
// 		required: ['token', 'method'],
// 		additionalProperties: false
// 	}
// }

// export const login2faverify = {
// 	body: {
// 		type: 'object',
// 		properties: {
// 			token: { type: 'string' },
// 			code: { type: 'string' }
// 		},
// 		required: ['token', 'code'],
// 		additionalProperties: false
// 	}
// }

// export const login2faresend = {
// 	body: {
// 		type: 'object',
// 		properties: {
// 			token: { type: 'string' }
// 		},
// 		required: ['token'],
// 		additionalProperties: false
// 	}
// }

// export const _2faenabledpost = {
// 	params: {
// 		type: 'object',
// 		properties: {
// 			method: { type: 'string', enum: ['EMAIL', 'SMS'] }
// 		},
// 		required: ['method'],
// 		additionalProperties: false
// 	}
// }

// export const _2faenableddelete = {
// 	params: {
// 		type: 'object',
// 		properties: {
// 			method: { type: 'string', enum: ['EMAIL', 'SMS', 'TOTP'] }
// 		},
// 		required: ['method'],
// 		additionalProperties: false
// 	}
// }

// export const _2fasetuptotp = {}
// export const _2fasetuptotpverify = {
// 	body: {
// 		type: 'object',
// 		properties: {
// 			token: { type: 'string' },
// 			code: { type: 'string' }
// 		},
// 		required: ['token', 'code'],
// 		additionalProperties: false
// 	}
// }

// export const changepassword = {
// 	body: {
// 		type: 'object',
// 		properties: {
// 			oldPassword: { type: 'string' },
// 			newPassword: { type: 'string' }
// 		},
// 		required: ['oldPassword', 'newPassword'],
// 		additionalProperties: false
// 	}
// }

// export const resetpassword = {
// 	body: {
// 		type: 'object',
// 		properties: {
// 			email: { type: 'string' }
// 		},
// 		required: ['email'],
// 		additionalProperties: false
// 	}
// }

// export const resetpasswordverify = {
// 	body: {
// 		type: 'object',
// 		properties: {
// 			token: { type: 'string' },
// 			code: { type: 'string' }
// 		},
// 		required: ['token', 'code'],
// 		additionalProperties: false
// 	}
// }

// export const resetpasswordresend = {
// 	body: {
// 		type: 'object',
// 		properties: {
// 			token: { type: 'string' }
// 		},
// 		required: ['token'],
// 		additionalProperties: false
// 	}
// }

// export const resetpasswordupdate = {
// 	body: {
// 		type: 'object',
// 		properties: {
// 			token: { type: 'string' }
// 		},
// 		required: ['token'],
// 		additionalProperties: false
// 	}
// }

// export const sessioniddelete = {
// 	params: {
// 		type: 'object',
// 		properties: {
// 			id: { type: 'string' }
// 		},
// 		required: ['id'],
// 		additionalProperties: false
// 	}
// }

// export const verifycontact = {
// 	params: {
// 		type: 'object',
// 		properties: {
// 			contact: { type: 'string', enum: ['email', 'phone'] }
// 		},
// 		required: ['contact'],
// 		additionalProperties: false
// 	}
// }

// export const verifycontactverify = {
// 	params: {
// 		type: 'object',
// 		properties: {
// 			contact: { type: 'string', enum: ['email', 'phone'] }
// 		},
// 		required: ['contact'],
// 		additionalProperties: false
// 	},
// 	body: {
// 		type: 'object',
// 		properties: {
// 			token: { type: 'string' },
// 			code: { type: 'string' }
// 		},
// 		required: ['token', 'code'],
// 		additionalProperties: false
// 	}
// }

// export const verifycontactresend = {
// 	params: {
// 		type: 'object',
// 		properties: {
// 			contact: { type: 'string', enum: ['email', 'phone'] }
// 		},
// 		required: ['contact'],
// 		additionalProperties: false
// 	},
// 	body: {
// 		type: 'object',
// 		properties: {
// 			token: { type: 'string' }
// 		},
// 		required: ['token'],
// 		additionalProperties: false
// 	}
// }
