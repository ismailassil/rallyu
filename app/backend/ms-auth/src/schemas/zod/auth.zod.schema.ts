import { z } from 'zod';

/* Registration and Login Schemas */

export const zodRegisterSchema = z.object({
	first_name: z.string()
		.min(2, "First name must be at least 2 characters")
		.max(10, "First name must be at most 10 characters")
		.regex(/^[A-Za-z]+$/, "First name must contain only letters"),  
	last_name: z.string()
		.min(2, "Last name must be at least 2 characters")
		.max(10, "Last name must be at most 10 characters")
		.regex(/^[A-Za-z]+$/, "Last name must contain only letters"),
	username: z.string()
		.min(3, "Username must be at least 3 characters")
		.max(50, "Username must be at most 50 characters")
		.regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
	email: z.string().email("Invalid email address"),
	password: z.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/(?=.*[a-z])/, "Password must contain a lowercase letter")
		.regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
		.regex(/(?=.*\d)/, "Password must contain a digit")
});

export const zodLoginSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password is required")
});



/* Change Password Schema */

export const zodChangePasswordSchema = z.object({
	oldPassword: z.string().min(1, "Old password is required"),
	newPassword: z.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/(?=.*[a-z])/, "Password must contain a lowercase letter")
		.regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
		.regex(/(?=.*\d)/, "Password must contain a digit")
});




/* Password Reset Schemas */

export const zodResetPasswordSchema = z.object({
	email: z.string().email("Invalid email address")
});

export const zodResetPasswordVerifySchema = z.object({
	token: z.string().min(1, "Token is required"),
	code: z.string().min(1, "Code is required")
});

export const zodResetPasswordUpdateSchema = z.object({
	token: z.string().min(1, "Token is required"),
	newPassword: z.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/(?=.*[a-z])/, "Password must contain a lowercase letter")
		.regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
		.regex(/(?=.*\d)/, "Password must contain a digit")
});



/* Two-Factor Authentication Schemas */

export const zodTwoFactorLoginChallengeSchema = z.object({
	token: z.string().min(1, "Token is required"),
	method: z.enum(["SMS", "EMAIL", "TOTP"], {
		required_error: "Method is required",
		invalid_type_error: "Method must be one of: SMS, EMAIL, TOTP",
	})
});

export const zodTwoFactorLoginChallengeVerifyCodeSchema = z.object({
	token: z.string().min(1, "Token is required"),
	code: z.string().min(1, "Code is required")
});

export const zodTwoFactorSetupSchema = z.object({
	method: z.enum(["SMS", "EMAIL", "TOTP"], {
		required_error: "Method is required",
		invalid_type_error: "Method must be one of: SMS, EMAIL, TOTP",
	})
});

export const zodTwoFactorSetupVerifySchema = z.object({
	code: z.string().min(1, "Code is required")
});
