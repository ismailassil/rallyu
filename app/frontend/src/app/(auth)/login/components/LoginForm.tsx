/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { toastError, toastSuccess } from '../../../components/CustomToast';
import { useRouter } from 'next/navigation';
import InputField from '../../components/shared/form/InputField';
import useForm from '@/app/hooks/useForm';
import { loginFormSchema } from '@/app/(api)/schema';
import FormButton from '../../components/shared/ui/FormButton';
import { LogIn } from 'lucide-react';
import { FormProvider } from '../../components/shared/form/FormContext';

export default function LoginForm() {
	const { login } = useAuth();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, touched, errors, debounced, handleChange, validateAll, resetForm] = useForm(
		loginFormSchema,
		{ username: '', password: '' } // Removed email from initial values since login doesn't use it
	);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		
		const isValid = validateAll();
		if (!isValid)
			return ;
		
		setIsSubmitting(true);
		try {
			const res = await login(formData.username, formData.password);
			if (res._2FARequired) {
				toastSuccess('Two Factor Authentication is required!');
				router.push('/two-factor');
			} else
				toastSuccess('Logged in successfully');
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
				<InputField 
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/at.svg'
					label='Username'
					field='username'
					inputPlaceholder='xezzuz'
				/>
				<InputField 
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/lock.svg'
					label='Password'
					field='password'
					inputPlaceholder='••••••••••••••••'
					inputHidden={true}
				>
					<p className='text-sm text-end hover:underline cursor-pointer'
						onClick={() => router.push('/reset-password')}>
						Forgot Password?
					</p>
				</InputField>
				<FormButton
					text='Sign In'
					icon={<LogIn size={16} />}
					type='submit'
					isSubmitting={isSubmitting}
				/>
			</form>
		</FormProvider>
	);
}
