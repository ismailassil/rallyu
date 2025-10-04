/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useCallback } from 'react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { toastError, toastSuccess } from '../../../components/CustomToast';
import { useRouter } from 'next/navigation';
import InputField from '../../components/shared/form/InputField';
import useForm from '@/app/hooks/useForm';
import { signupFormSchema } from '@/app/(api)/schema';
import PasswordStrengthIndicator from '../../components/shared/form/PasswordStrengthIndicator';
import FormFieldAvailability from '../../components/shared/form/FormFieldAvailability';
import FormButton from '../../components/shared/ui/FormButton';
import { LogIn } from 'lucide-react';
import { FormProvider } from '../../components/shared/form/FormContext';
import useUsernameEmailAvailability from '@/app/hooks/useUsernameEmailAvailability';
import AvailabilityIndicator from '../../components/shared/form/AvailabilityIndicator';

export default function SignUpForm() {
	const router = useRouter();
	const { register } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const [formData, touched, errors, debounced, handleChange, validateAll, resetForm] = useForm(
		signupFormSchema,
		{ first_name: '', last_name: '', username: '', email: '', password: '' },
		{ debounceMs: { email: 4000, username: 4000, password: 4000 } }
	);

	const usernameStatus = useUsernameEmailAvailability('username', formData.username, !!errors.username || !debounced.username);
	const emailStatus = useUsernameEmailAvailability('email', formData.email, !!errors.email || !debounced.email);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const isValid = validateAll();
		if (!isValid)
			return ;

		setIsSubmitting(true);
		try {
			await register(
				formData.first_name,
				formData.last_name,
				formData.username,
				formData.email,
				formData.password
			);
			toastSuccess('Account created successfully...');
			router.replace('/login');
		} catch (err: any) {
			toastError(err.message || 'Something went wrong, please try again later');
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<FormProvider
			formData={formData}
			touched={touched}
			errors={errors}
			debounced={debounced}
			handleChange={handleChange}
			validateAll={validateAll}
			resetForm={resetForm}
		>
			<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
				<div className='flex flex-col gap-5 sm:flex-row sm:gap-2'>
					<InputField 
						className='field flex flex-col gap-0.5 min-w-0 flex-1'
						iconSrc='/icons/firstname.svg'
						label='First Name'
						field='first_name'
						inputPlaceholder='Achraf'
					/>
					<InputField 
						className='field flex flex-col gap-0.5 min-w-0 flex-1'
						iconSrc='/icons/lastname.svg'
						label='Last Name'
						field='last_name'
						inputPlaceholder='Demnati'
					/>
				</div>
				<InputField 
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/at.svg'
					label='Username'
					field='username'
					inputPlaceholder='xezzuz'
				>
					{formData.username && formData.username.length >= 3 && !errors.username && debounced.username && (
						<AvailabilityIndicator label='Username' status={usernameStatus} />
					)}
				</InputField>
				<InputField 
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/mail.svg'
					label='Email'
					field='email'
					inputPlaceholder='iassil@1337.student.ma'
				>
					{formData.email && formData.email.length >= 3 && !errors.email && debounced.email && (
						<AvailabilityIndicator label='Email' status={emailStatus} />
					)}
				</InputField>
				<InputField 
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/lock.svg'
					label='Password'
					field='password'
					inputPlaceholder='••••••••••••••••'
					inputHidden={true}
				>
					{formData.password && <PasswordStrengthIndicator value={formData.password} />}
				</InputField>
				<FormButton
					text='Sign Up'
					icon={<LogIn size={16} />}
					type='submit'
					isSubmitting={isSubmitting}
				/>
			</form>
		</FormProvider>
	);
}
