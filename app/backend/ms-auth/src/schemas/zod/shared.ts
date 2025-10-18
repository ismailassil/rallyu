import { z } from 'zod';

export const firstNameField = z.string()
	.nonempty('first_name.required')
	.min(2, 'first_name.min')
	.max(15, 'first_name.max')
	.regex(/^[A-Za-z\s\-']+$/, 'first_name.format');

export const lastNameField = z.string()
	.nonempty('last_name.required')
	.min(2, 'last_name.min')
	.max(15, 'last_name.max')
	.regex(/^[A-Za-z\s\-']+$/, 'last_name.format');

export const usernameField = z.string()
	.nonempty('username.required')
	.min(3, 'username.min')
	.max(10, 'username.max')
	.regex(/^[a-zA-Z0-9_]+$/, 'username.format');

export const emailField = z.string()
	.nonempty('email.required')
	.email('email.invalid');

export const passwordField = z.string()
	.nonempty('password.required')
	.min(8, 'password.min')
	.regex(/(?=.*[a-z])/, 'password.lowercase')
	.regex(/(?=.*[A-Z])/, 'password.uppercase')
	.regex(/(?=.*\d)/, 'password.digit');

export const phoneNumberField = z.string()
	.nonempty('phone.required')
	.e164('phone.format');

export const bioField = z.string()
	.nonempty('bio.required')
	.min(3, 'bio.min')
	.max(50, 'bio.max');
