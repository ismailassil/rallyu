/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { toastError, toastSuccess } from '../../../components/CustomToast';
import { useRouter } from 'next/navigation';
import InputField from '../../components/shared/form/InputField';
import useForm from '@/app/hooks/useForm';
import { loginFormSchema } from '@/app/(api)/schema';
import FormButton from '../../components/shared/ui/FormButton';
import { LogIn } from 'lucide-react';
import { FormProvider } from '../../components/shared/form/FormContext';
import useAPICall from '@/app/hooks/useAPICall';

export default function LoginForm() {
	const { login } = useAuth();
	const router = useRouter();
	const { isLoading, executeAPICall } = useAPICall();
	const [formData, touched, errors, debounced, handleChange, validateAll, getValidationErrors, resetForm] = useForm(
		loginFormSchema,
		{ username: '', password: '' }
	);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		
		const isValid = validateAll();
		if (!isValid)
			return ;

		try {
			const result = await executeAPICall(() => login(formData.username, formData.password));
			if (result._2FARequired) {
				toastSuccess('Two Factor Authentication is required!');
				router.push('/two-factor');
			}
			else
				toastSuccess('Logged in successfully');
		} catch (err: any) {
			toastError(err.message || 'Something went wrong, please try again later');
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
			getValidationErrors={getValidationErrors}
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
					isSubmitting={isLoading}
				/>
			</form>
		</FormProvider>
	);
}
