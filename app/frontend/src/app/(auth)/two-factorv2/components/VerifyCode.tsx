import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useState } from "react";
import { alertError, alertLoading, alertSuccess } from "../../components/CustomToast";
import Image from "next/image";
import React from "react";

type VerifyCodeProps = {
	selectedMethod: string;
	description: string;
}

export default function VerifyCode({ selectedMethod, description } : VerifyCodeProps) {
	const [code, setCode] = useState('');
	const { verify2FACode, isAuthenticated } = useAuth();

	console.log('RENDERING VERIFYCODE');

	if (isAuthenticated)
		return null;

	const loginChallengeIDrw = sessionStorage.getItem('loginChallengeID');
	const enabledMethodsrw = sessionStorage.getItem('enabledMethods');
	if (!loginChallengeIDrw || !enabledMethodsrw)
		return <div>DEV - VERIFYCODESTEP - Invalid login session state. Should be redirected to /login</div>;
		// router.replace('/login');

	let loginChallengeID: number;
	let enabledMethods: string[];
	try {
		loginChallengeID = JSON.parse(loginChallengeIDrw);
		enabledMethods = JSON.parse(enabledMethodsrw);
		if (typeof loginChallengeID !== 'number' || !Array.isArray(enabledMethods)) {
			throw new Error();
		}
	} catch {
		return <div>DEV - VERIFYCODESTEP - Corrupted login session state</div>;
	}

	// const loginChallengeID = JSON.parse(sessionStorage.getItem('loginChallengeID'));
	// if (!loginChallengeID)
	// 	return <div>loginChallengeID is not present in sessionStorage</div>;

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;

		if (value.length > 6)
			return ;
		setCode(value);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!loginChallengeID)
			return ;

		try {
			alertLoading('Loggin you in...');
			await verify2FACode(loginChallengeID, selectedMethod, code);
			alertSuccess('Logged in successfully');
		} catch {
			alertError('Something Went Wrong!');
		}
	}

	return (
		<>
			<div className='flex flex-col gap-2 mb-2'>
				<div className='flex flex-row gap-2'>
					{/* <img src='/icons/lock.svg' className='h-full w-[8%]'/> */}
					<h1 className='font-semibold text-3xl'>Two Factor Authentication</h1>
				</div>
				<p className='mb-0 text-gray-200'>{description}</p>
			</div>
			<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
				<div className='field flex flex-col gap-0.5 box-border'>
					<label htmlFor="code">Code</label>
					<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg custom-input border border-white/10'>
						<Image alt="Lock" src={'/icons/lock.svg'} width={20} height={20}></Image>
						<input id='code' name='code' type='number' placeholder='••••••' value={code} onChange={handleChange} className='outline-none flex-1 overflow-hidden'/>
					</div>
				</div>
				<button className='h-11 bg-blue-600 hover:bg-blue-700 rounded-lg mt-2' type='submit'>Submit</button>
			</form>
			<p className='self-center'>Didn&#39;t get the code? <a href='/signup' className='font-semibold text-blue-500 hover:underline'>Resend code</a></p>
		</>
	);
}
