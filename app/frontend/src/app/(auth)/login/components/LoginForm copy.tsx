/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import FormFieldError from '../../signup/components/FormFieldError';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { alertError, alertLoading, alertSuccess } from '../../components/CustomToast';
import { useRouter } from 'next/navigation';
import { APIError } from '@/app/(api)/APIClient';

export default function LoginForm() {
	const { login } = useAuth();
	const router = useRouter();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [usernameError, setUsernameError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		console.log('MOUNTING LOGIN FORM COMPONENT');
	}, []);

	function handleToggleShowPassword() {
		setShowPassword(!showPassword);
	}
	
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		
		if (name === 'username') {
			if (value) setUsernameError('');
			setUsername(value);
		}
		else if (name === 'password') {
			if (value) setPasswordError('');
			setPassword(value);
		}
	}
	
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		
		const usernameErr = username ? '' : 'Username is required';
		const passwordErr = password ? '' : 'Password is required';
		setUsernameError(usernameErr);
		setPasswordError(passwordErr);

		if (usernameErr || passwordErr)
			return ;
		
		setIsSubmitting(true);
		try {
			alertLoading('Loggin you in...');
			const res = await login(username, password);
			if (res._2FARequired) {
				alertSuccess('Two Factor Authentication is required!');

				// setTimeout(() => {
					router.push('/two-factorv3');
				// }, 1000);
			} else
				alertSuccess('Logged in successfully');
		} catch (err) {
			console.log('ERROR CATCHED IN LOGIN FORM SUBMIT: ', err);
			const apiErr = err as APIError;
			alertError(apiErr.message);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
			<div className='field flex flex-col gap-0.5 box-border'>
				<label htmlFor="username">Username</label>
				<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg custom-input border border-white/10'>
					<Image 
						alt='Username' 
						src='/icons/at.svg' 
						width={20} 
						height={20}
					></Image>
					<input 
						id='username' 
						name='username' 
						type='text' 
						placeholder='xezzuz' 
						value={username} 
						onChange={handleChange} 
						className='outline-none flex-1 overflow-hidden' 
					/>
				</div>
				<AnimatePresence>
					{usernameError && <FormFieldError error={usernameError} />}
				</AnimatePresence>
			</div>
			<div className='field flex flex-col gap-0.5 box-border'>
				<label htmlFor="password">Password</label>
				<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg custom-input border border-white/10'>
					<Image 
						alt='Password' 
						src='/icons/lock.svg' 
						width={20} 
						height={20}
					></Image>
					<input 
						id='password' 
						name='password' 
						type={ showPassword ? 'text' : 'password'}
						placeholder='••••••••••••••••' 
						value={password} 
						onChange={handleChange} 
						className='outline-none flex-1 overflow-hidden' 
						/>
					<Image alt='Hide Password' 
						src	={showPassword ? '/icons/eye.svg' : '/icons/eye-slash-light.svg' } 
						width={showPassword ? 18.5 : 20} 
						height={showPassword ? 18.5 : 20}
						onClick={handleToggleShowPassword}
					></Image>
				</div>
				<AnimatePresence>
					{passwordError && <FormFieldError error={passwordError} />}
				</AnimatePresence>
				<a href='/reset-password' className='text-blue-50 font-light text-sm text-right hover:underline font-poppins'>Forgot Password?</a>
			</div>
			<button className={`h-11 mt-2 rounded-lg transition-all duration-200 ${
					isSubmitting 
					? 'bg-gray-700 cursor-not-allowed'
					: 'bg-blue-600 hover:bg-blue-700 hover:shadow-2xl active:scale-98'
				}`} 
					type='submit'
					disabled={isSubmitting}
				>
					Sign in
			</button>
		</form>
	);
}
