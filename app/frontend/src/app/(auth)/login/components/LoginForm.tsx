/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { useState } from 'react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { toastError, toastSuccess } from '../../../components/CustomToast';
import { useRouter } from 'next/navigation';
import FormField from '../../components/shared/form/FormField';
import useForm from '@/app/hooks/useForm';
import { loginFormSchema } from '@/app/(api)/schema';
import FormButton from '../../components/shared/ui/FormButton';
import { LogIn } from 'lucide-react';

export default function LoginForm() {
	const { login } = useAuth();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, touched, errors, debounced, handleChange, validateAll] = useForm(
		loginFormSchema,
		{ username: '', email: '', password: '' }
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
		<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
			<FormField 
				className='field flex flex-col gap-0.5 box-border'
				iconSrc='/icons/at.svg'
				label='Username'
				field='username'
				inputPlaceholder='xezzuz'
				inputValue={formData.username}
				onChange={handleChange}
				touched={touched.username}
				error={errors.username}
				debounced={debounced.username}
			/>
			<FormField 
				className='field flex flex-col gap-0.5 box-border'
				iconSrc='/icons/lock.svg'
				label='Password'
				field='password'
				inputPlaceholder='••••••••••••••••'
				inputValue={formData.password}
				hidden={true}
				onChange={handleChange}
				touched={touched.password}
				error={errors.password}
				debounced={debounced.password}
			>
				<p className='text-sm text-end hover:underline cursor-pointer'
					onClick={() => router.push('/reset-password')}>
					Forgot Password?
				</p>
			</FormField>
			{/* <button className={`h-11 mt-2 rounded-lg transition-all duration-200 ${
					isSubmitting 
					? 'bg-gray-700 cursor-not-allowed'
					: 'bg-blue-600 hover:bg-blue-700 hover:shadow-2xl active:scale-98'
				}`} 
					type='submit'
					disabled={isSubmitting}
				>
					Sign Up
			</button> */}
			<FormButton
				text='Sign In'
				icon={<LogIn size={16} />}
				type='submit'
				isSubmitting={isSubmitting}
			/>
		</form>
	);
}
