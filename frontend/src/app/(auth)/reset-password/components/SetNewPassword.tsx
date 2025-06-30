import Image from "next/image";
import { useState } from "react";

async function changePassword(email: string, code: string, password: string) : Promise<void> {
	const response = await fetch(`http://localhost:4000/api/auth/reset/update`, {
		method: 'POST',
		headers: {
			'Content-Type': `application/json`
		},
		body: JSON.stringify({
			email,
			code,
			password
		})
	});

	console.log('response status: ', response.status);

	if (response.status !== 200)
		throw new Error('Invalid code');
}

export function SetNewPassword({ email, code, onValidSubmit } : { email: string, code: string, onValidSubmit: () => void }) {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;

		if (name === 'password')
			setPassword(value);
		else if (name === 'new_password')
			setConfirmPassword(value);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (password !== confirmPassword)
			return ;

		try {
			await changePassword(email, code, password);
			onValidSubmit();
		} catch (err: any) {
			console.log('error catched: ', err.message);
		}
	}

	return (
		<>
			<div className='flex flex-col gap-2 mb-2'>
				<div className='flex flex-row gap-2'>
					{/* <img src='/icons/lock.svg' className='h-full w-[8%]'/> */}
					<h1 className='font-semibold text-3xl'>Create a New Password</h1>
				</div>
				<p className='mb-0 text-gray-200'>Please enter and confirm your new password.</p>
			</div>
			<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
				<div className='field flex flex-col gap-0.5 box-border'>
					<label htmlFor="password">Password</label>
					<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg custom-input border border-white/10'>
						<Image alt="Password" src={'/icons/lock.svg'} width={20} height={20}></Image>
						<input id='password' name='password' type='password' placeholder='••••••' value={password} onChange={handleChange} className='outline-none flex-1 overflow-hidden'/>
					</div>
				</div>
				<div className='field flex flex-col gap-0.5 box-border'>
					<label htmlFor="new_password">Confirm Password</label>
					<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg custom-input border border-white/10'>
						<Image alt="Password" src={'/icons/lock.svg'} width={20} height={20}></Image>
						<input id='new_password' name='new_password' type='password' placeholder='••••••' value={confirmPassword} onChange={handleChange} className='outline-none flex-1 overflow-hidden'/>
					</div>
				</div>
				<button className='h-11 bg-blue-600 hover:bg-blue-700 rounded-lg mt-2' type='submit'>Reset Password</button>
			</form>
			<p className='self-center'>Remember your password? <a href='/signup' className='font-semibold text-blue-500 hover:underline'>Sign in</a></p>
		</>
	);
}
