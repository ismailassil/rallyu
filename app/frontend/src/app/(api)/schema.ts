import { z } from "zod";

export const signupFormSchema = z.object({
	first_name: z.string()
		.nonempty("First name is required")
		.min(2, "First name must be at least 2 characters")
		.max(10, "First name must be at most 10 characters")
		.regex(/^[A-Za-z]+$/, "First name must contain only letters"),

	last_name: z.string()
		.nonempty("Last name is required")
		.min(2, "Last name must be at least 2 characters")
		.max(10, "Last name must be at most 10 characters")
		.regex(/^[A-Za-z]+$/, "Last name must contain only letters"),

	username: z.string()
		.nonempty("Username is required")
		.min(3, "Username must be at least 3 characters")
		.max(10, "Username must be at most 10 characters")
		.regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),

	email: z.string()
		.nonempty("Email is required")
		.email("Invalid email address"),

	password: z.string()
		.nonempty("Password is required")
		.min(8, "Password must be at least 8 characters")
		.regex(/(?=.*[a-z])/, "Password must contain a lowercase letter")
		.regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
		.regex(/(?=.*\d)/, "Password must contain a digit"),
});

export const loginFormSchema = z.object({
	username: z.string()
		.nonempty("Username is required"),

	password: z.string()
		.nonempty("Password is required")
});

export const personalInfoSettingsSchema = z.object({
	first_name: z.string()
		.nonempty("First name is required")
		.min(2, "First name must be at least 2 characters")
		.max(10, "First name must be at most 10 characters")
		.regex(/^[A-Za-z]+$/, "First name must contain only letters"),

	last_name: z.string()
		.nonempty("Last name is required")
		.min(2, "Last name must be at least 2 characters")
		.max(10, "Last name must be at most 10 characters")
		.regex(/^[A-Za-z]+$/, "Last name must contain only letters"),

	username: z.string()
		.nonempty("Username is required")
		.min(3, "Username must be at least 3 characters")
		.max(10, "Username must be at most 10 characters")
		.regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),

	email: z.string()
		.nonempty("Email is required")
		.email("Invalid email address"),

	bio: z.string()
		.nonempty("Bio is required")
		.min(3, "Bio must be at least 3 characters")
		.max(50, "Bio must be at most 50 characters")
});

export const resetPasswordSchema = z.object({
	email: z.string()
		.nonempty("Email is required")
		.email("Invalid email address"),

	password: z.string()
		.nonempty("Password is required")
		.min(8, "Password must be at least 8 characters")
		.regex(/(?=.*[a-z])/, "Password must contain a lowercase letter")
		.regex(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
		.regex(/(?=.*\d)/, "Password must contain a digit"),

	confirm_password: z.string()
		.nonempty("Please confirm your password"),
		}).refine((data) => data.password === data.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"],
});