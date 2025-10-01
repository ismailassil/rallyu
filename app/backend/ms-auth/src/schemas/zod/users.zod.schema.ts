import { z } from 'zod';

/* User Update Schema */

export const userUpdateSchemaZod = z.object({
	first_name: z.string()
		.min(2, "First name must be at least 2 characters")
		.max(10, "First name must be at most 10 characters")
		.regex(/^[A-Za-z]+$/, "First name must contain only letters")
		.optional(),

	last_name: z.string()
		.min(2, "Last name must be at least 2 characters")
		.max(10, "Last name must be at most 10 characters")
		.regex(/^[A-Za-z]+$/, "Last name must contain only letters")
		.optional(),

	email: z.string().email("Invalid email address")
		.optional(),

	username: z.string()
		.min(3, "Username must be at least 3 characters")
		.max(50, "Username must be at most 50 characters")
		.regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
		.optional(),
	
	bio: z.string().max(250, "Bio must be at most 250 characters")
		.optional(),
	
	}).refine(data => Object.keys(data).length > 0, {
		message: "At least one field must be provided for update"
});