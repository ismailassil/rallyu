import { z } from 'zod';
import { bioField, emailField, firstNameField, lastNameField, phoneNumberField, usernameField } from './shared';

const userupdate = z.object({
	first_name: firstNameField.optional(),
	last_name: lastNameField.optional(),
	username: usernameField.optional(),
	email: emailField.optional(),
	phone: phoneNumberField.optional(),
	bio: bioField.optional(),
}).refine(data => Object.keys(data).length > 0, {
	message: "update.min"
});


export const usersRoutesZodSchemas = {
	users: {
		update: userupdate
	}
}
