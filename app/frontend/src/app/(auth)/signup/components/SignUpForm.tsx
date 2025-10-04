/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useCallback } from 'react';
import { useState } from 'react';
import useForm from '@/app/hooks/useForm';
import FormField from '../../components/shared/form/FormField';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { toastError, toastSuccess } from '../../../components/CustomToast';
import { useRouter } from 'next/navigation';
import { signupFormSchema } from '@/app/(api)/schema';
import PasswordStrength from '../../components/shared/form/PasswordStrength';
import FormFieldAvailability from '../../components/shared/form/FormFieldAvailability';
import FormButton from '../../components/shared/ui/FormButton';
import { Loader, Loader2, LoaderPinwheel, LogIn } from 'lucide-react';

export default function SignUpForm() {
	const router = useRouter();
	const { register } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [fieldsAvailable, setFieldsAvailable] = useState({
		username: false,
		email: false
	});

	const [formData, touched, errors, debounced, handleChange, validateAll] = useForm(
		signupFormSchema,
		{ first_name: '', last_name: '', username: '', email: '', password: '' },
		{ debounceMs: { email: 1200, username: 1200, password: 1200 } }
	);

	const updateFieldAvailable = useCallback((name: string, available: boolean) => {
		setFieldsAvailable(prev => ({ ...prev, [name]: available }));
	}, []);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const isValid = validateAll();
		if (!isValid)
			return ;

		if (!fieldsAvailable.username || !fieldsAvailable.email)
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
		<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
			<div className='flex flex-col gap-5 sm:flex-row sm:gap-2'>
				<FormField 
					className='field flex flex-col gap-0.5 min-w-0 flex-1'
					iconSrc='/icons/firstname.svg'
					label='First Name'
					field='first_name'
					inputPlaceholder='Achraf'
					inputValue={formData.first_name}
					onChange={handleChange}
					touched={touched.first_name}
					error={errors.first_name}
					debounced={debounced.first_name}
				/>
				<FormField 
					className='field flex flex-col gap-0.5 min-w-0 flex-1'
					iconSrc='/icons/lastname.svg'
					label='Last Name'
					field='last_name'
					inputPlaceholder='Demnati'
					inputValue={formData.last_name}
					onChange={handleChange}
					touched={touched.last_name}
					error={errors.last_name}
					debounced={debounced.last_name}
				/>
			</div>
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
			>
				{debounced.username && touched.username && !errors.username && formData.username && formData.username.length >= 3 && (
					<FormFieldAvailability 
						label='Username'
						name='username'
						value={formData.username}
						setFieldAvailable={updateFieldAvailable}
					/>
				)}
			</FormField>
			<FormField 
				className='field flex flex-col gap-0.5 box-border'
				iconSrc='/icons/mail.svg'
				label='Email'
				field='email'
				inputPlaceholder='iassil@1337.student.ma'
				inputValue={formData.email}
				onChange={handleChange}
				touched={touched.email}
				error={errors.email}
				debounced={debounced.email}
			>
				{debounced.email && touched.email && !errors.email && formData.email && formData.email.length >= 3 && (
					<FormFieldAvailability 
						label='Email'
						name='email'
						value={formData.email}
						setFieldAvailable={updateFieldAvailable}
					/>
				)}
			</FormField>
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
				{touched.password && formData.password && <PasswordStrength value={formData.password} />}
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
				text='Sign Up'
				icon={<LogIn size={16} />}
				type='submit'
				isSubmitting={isSubmitting}
			/>
		</form>
	);
}
