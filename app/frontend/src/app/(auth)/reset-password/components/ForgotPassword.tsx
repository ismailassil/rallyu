import Image from "next/image";
import FormFieldError from "../../components/Forms/FormFieldError";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

async function resetPassword(email: string) : Promise<void> {
		const response = await fetch(`http://localhost:4025/api/auth/reset/setup`, {
			method: 'POST',
			headers: {
				'Content-Type': `application/json`
			},
			body: JSON.stringify({
				email
			})
		});

		console.log('response status: ', response.status);

		if (response.status !== 200)
			throw new Error('No user exists with this email');
}

export function ForgotPassword({ email, setEmail, onValidSubmit } : { email: string, setEmail: (value: string) => void, onValidSubmit: () => void }) {
	// const [email, setEmail] = useState('');
	const [error, setError] = useState('');

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;

		setError('');
		setEmail(value);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		// onValidSubmit();
		// return ;
		
		if (!email) {
			setError('Email is required');
			return ;
		}
		
		try {
			await resetPassword(email);
			onValidSubmit();
		} catch (err: any) {
			console.log('error catched: ', err.message);
			setError(err.message);
		}
	}

	return (
		<>
			<div className='flex flex-col gap-2 mb-2'>
				<div className='flex flex-row gap-2'>
					{/* <img src='/icons/lock.svg' className='h-full w-[8%]'/> */}
					<h1 className='font-semibold text-3xl'>Forgot your password?</h1>
				</div>
				<p className='mb-0 text-gray-200'>Enter your email address, and we&#39;ll send you a link to reset your password.</p>
			</div>
			<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
				<div className='field flex flex-col gap-0.5 box-border'>
					<label htmlFor="email">Email</label>
					<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg custom-input border border-white/10'>
						<Image alt="Email" src={'/icons/mail.svg'} width={20} height={20}></Image>
						<input id='email' name='email' type='text' placeholder='iassil@1337.student.ma' value={email} onChange={handleChange} className='outline-none flex-1 overflow-hidden'/>
					</div>
				</div>
				<AnimatePresence>
					{error && <FormFieldError error={error} />}
				</AnimatePresence>
				<button className='h-11 bg-blue-600 hover:bg-blue-700 rounded-lg mt-2' type='submit'>Reset Password</button>
			</form>
			<p className='self-center'>Remember your password? <a href='/signup' className='font-semibold text-blue-500 hover:underline'>Sign in</a></p>
		</>
	);
}
