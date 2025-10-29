import { z } from "zod";

const trim = (val: any): string => {
	return typeof val === 'string' ? val.trim() : '';
};

const trimAndLowercase = (val: any): string => {
	return typeof val === 'string' ? val.trim().toLowerCase() : '';
};

export const firstNameField = z.preprocess(
	trim,
	z.string()
	.min(1, 'first_name.required')
	.min(2, 'first_name.min')
	.max(15, 'first_name.max')
	.regex(/^[A-Za-z\s\-']+$/, 'first_name.format')
);

export const lastNameField = z.preprocess(
	trim,
	z.string()
	.min(1, 'last_name.required')
	.min(2, 'last_name.min')
	.max(15, 'last_name.max')
	.regex(/^[A-Za-z\s\-']+$/, 'last_name.format')
);

export const usernameField = z.preprocess(
	trim,
	z.string()
	.min(1, 'username.required')
	.min(3, 'username.min')
	.max(10, 'username.max')
	.regex(/^[a-zA-Z0-9_]+$/, 'username.format')
);

export const emailField = z.preprocess(
	trimAndLowercase,
	z.string()
	.min(1, 'email.required')
	.email('email.invalid')
);

export const passwordField = z.string()
	.nonempty('password.required')
	.min(8, 'password.min')
	.regex(/(?=.*[a-z])/, 'password.lowercase')
	.regex(/(?=.*[A-Z])/, 'password.uppercase')
	.regex(/(?=.*\d)/, 'password.digit');

export const phoneNumberField = z.preprocess(
	trim,
	z.string()
	.min(1, 'phone.required')
	.e164('phone.format')
);

export const bioField = z.preprocess(
	trim,
	z.string()
	.min(1, 'bio.required')
	.min(3, 'bio.min')
	.max(150, 'bio.max')
);
