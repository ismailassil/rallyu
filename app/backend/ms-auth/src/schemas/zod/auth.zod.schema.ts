import { z } from 'zod';
import { emailField, firstNameField, lastNameField, passwordField, phoneNumberField, usernameField } from './shared';

const register = z.object({
	first_name: firstNameField,
	last_name: lastNameField,
	username: usernameField,
	email: emailField,
	password: passwordField
});

const changepassword = z.object({
	newPassword: passwordField
});

const resetpassword = z.object({
	email: emailField
});

const verifyemail = z.object({
	target: emailField
});

const verifyphone = z.object({
	target: phoneNumberField
});

export const authRoutesZodSchemas = {
	core: {
		register: register
	},
	password: {
		change: changepassword,
		reset: {
			request: resetpassword
		}
	},
	verify: {
		email: verifyemail,
		phone: verifyphone
	}
}
