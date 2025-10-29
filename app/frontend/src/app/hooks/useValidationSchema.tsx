'use client';
import { z } from 'zod';
import { useTranslations } from "next-intl";
import { useMemo } from 'react';


export default function useValidationSchema() {
	const t = useTranslations('auth.validation');

	return useMemo(() => {
		const firstNameField = z.string()
			.min(1,t('first_name.required'))
			.min(2, t('first_name.min'))
			.max(15, t('first_name.max'))
			.regex(/^[A-Za-z\s\-']+$/, t('first_name.format'));

		const lastNameField = z.string()
			.min(1, t('last_name.required'))
			.min(2, t('last_name.min'))
			.max(15, t('last_name.max'))
			.regex(/^[A-Za-z\s\-']+$/, t('last_name.format'));

		const usernameField = z.string()
			.min(1, t('username.required'))
			.min(3, t('username.min'))
			.max(10, t('username.max'))
			.regex(/^[a-zA-Z0-9_]+$/, t('username.format'));

		const emailField = z.string()
			.min(1, t('email.required'))
			.email(t('email.invalid'));

		const passwordField = z.string()
			.min(1, t('password.required'))
			.min(8, t('password.min'))
			.regex(/(?=.*[a-z])/, t('password.lowercase'))
			.regex(/(?=.*[A-Z])/, t('password.uppercase'))
			.regex(/(?=.*\d)/, t('password.digit'));

		const bioField = z.string()
			.min(1, t('bio.required'))
			.min(3, t('bio.min'))
			.max(50, t('bio.max'));

		const phoneNumberField = z.string()
			.min(1, t('phone.required'))
			.e164(t('phone.format'));


		return {
			signupFormSchema: z.object({
				first_name: firstNameField,
				last_name: lastNameField,
				username: usernameField,
				email: emailField,
				password: passwordField
			}),

			loginFormSchema: z.object({
				username: z.string().min(1, t('username.required')),
				password: z.string().min(1, t('password.required')),
			}),

			personalInfoSettingsSchema: z.object({
				first_name: firstNameField,
				last_name: lastNameField,
				username: usernameField,
				email: emailField,
				bio: bioField,
			}),

			changePasswordSchema: z.object({
				current_password: z.string().min(1, t('current_password.required')),
				new_password: passwordField,
				confirm_new_password: z.string().min(1, t('confirm_password.required')),
			}).refine((data) => data.new_password === data.confirm_new_password, {
				message: t('password.no_match'),
				path: ["confirm_new_password"],
			}).refine((data) => data.new_password !== data.current_password, {
				message: t('password.same_as_current'),
				path: ["new_password"],
			}),

			resetPasswordUpdateSchema: z.object({
				password: passwordField,
				confirm_password: z.string().min(1, t('confirm_password.required')),
			}).refine((data) => data.password === data.confirm_password, {
				message: t('password.no_match'),
				path: ["confirm_password"],
			}),

			emailOnlySchema: z.object({
				email: emailField
			}),

			phoneOnlySchema: z.object({
				phone: phoneNumberField
			}),
		};
	}, [t]);
}
