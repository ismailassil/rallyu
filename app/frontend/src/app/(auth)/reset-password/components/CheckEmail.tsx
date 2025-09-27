import Image from "next/image";
import { useState } from "react";
import FormFieldError from "../../components/Forms/FormFieldError";
import { AnimatePresence } from "framer-motion";

async function verifyOTP(email: string, code: string) : Promise<void> {
	const response = await fetch(`http://localhost:4025/api/auth/reset/verify`, {
		method: 'POST',
		headers: {
			'Content-Type': `application/json`
		},
		body: JSON.stringify({
			email,
			code
		})
	});

	console.log('response status: ', response.status);

	if (response.status !== 200)
		throw new Error('Invalid code');
}

export function CheckEmail({ email, code, setCode, onValidSubmit } : { email: string, code: string, setCode: (value: string) => void, onValidSubmit: () => void }) {
	// const [code, setCode] = useState('');
	const [error, setError] = useState('');

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;

		setError('');
		setCode(value);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!code) {
			setError('Code is required');
			return ;
		}

		try {
			await verifyOTP(email, code);
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
					<h1 className='font-semibold text-3xl'>Check your Email!</h1>
				</div>
				<p className='mb-0 text-gray-200'>We&#39;ve sent you a one-time passcode to reset your password.</p>
			</div>
			<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
				<div className='field flex flex-col gap-0.5 box-border'>
					<label htmlFor="code">Code</label>
					<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg custom-input border border-white/10'>
						<Image alt="Passcode" src={'/icons/lock.svg'} width={20} height={20}></Image>
						<input id='code' name='code' type='text' placeholder='••••••' onChange={handleChange} className='outline-none flex-1 overflow-hidden'/>
					</div>
				</div>
				<AnimatePresence>
					{error && <FormFieldError error={error} />}
				</AnimatePresence>
				<button className='h-11 bg-blue-600 hover:bg-blue-700 rounded-lg mt-2' type='submit'>Reset Password</button>
			</form>
			<p className='self-center'>Haven&#39;t received our email? <a href='/signup' className='font-semibold text-blue-500 hover:underline'>Resend Email</a></p>
		</>
	);
}
