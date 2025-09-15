import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { alertError, alertLoading, alertSuccess } from "../../components/CustomToast";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { APIError } from "@/app/(api)/APIClient";

const METHOD_HELP: Record<string, string> = {
	totp: 'Enter the 6-digit code from your authenticator app.',
	sms: 'Enter the numeric code sent via SMS.',
	email: 'Enter the code sent via Email.',
};

interface VerifyCodeProps {
	session: { loginChallengeID: number; enabledMethods: string[] };
	selectedMethod: string;
}

export default function VerifyCode({ session, selectedMethod } : VerifyCodeProps) {
	const router = useRouter();
	const [code, setCode] = useState('');
	const { send2FACode, verify2FACode } = useAuth();

	const sendCode = useCallback(async () => {
		try {
			alertLoading('Sending code...');
			await send2FACode(session.loginChallengeID, selectedMethod);
			alertSuccess('Code sent!');
		} catch (err) {
			const apiErr = err as APIError;
			alertError(apiErr.message);
			router.replace('/login');
		}
	}, [session.loginChallengeID, selectedMethod, send2FACode, router]);

	useEffect(() => {
		sendCode();
	}, [sendCode]);

	console.log('RENDERING VERIFYCODE');

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value.replace(/\D/g, '');

		if (value.length > 6)
			return ;

		setCode(value);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		// add validation

		try {
			alertLoading('Verificating Code...');
			await verify2FACode(session.loginChallengeID, selectedMethod, code);
			alertSuccess('Logged in successfully');
		} catch (err) {
			// VERIFICATION ERRORS
				// SESSION EXPIRED
				// SESSION NOT FOUND
				// SESSION REVOKED (MAX SUBMIT/RESEND ATTEMPTS)
				// 2FA INVALID CODE
			const apiErr = err as APIError;
			alertError(apiErr.message);
			if (apiErr.code.includes('SESSION'))
				router.replace('/login');
		}
	}

	return (
		<>
			<div className='flex flex-col gap-2 mb-2'>
				<div className='flex flex-row gap-2'>
					{/* <img src='/icons/lock.svg' className='h-full w-[8%]'/> */}
					<h1 className='font-semibold text-3xl'>Two Factor Authentication</h1>
				</div>
				<p className='mb-0 text-gray-200'>{METHOD_HELP[selectedMethod]}</p>
			</div>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<label htmlFor="code">Code</label>
				<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg custom-input border border-white/10'>
					<Image alt="Lock" src={'/icons/lock.svg'} width={20} height={20}></Image>
					<input
						id="code"
						type="text"
						inputMode="numeric"
						pattern="\d{6}"
						placeholder="••••••"
						value={code}
						onChange={handleChange}
						className="outline-none flex-1 overflow-hidden"
					/>
				</div>
				<button
					type="submit"
					className="h-11 bg-blue-600 hover:bg-blue-700 rounded-lg"
					disabled={code.length < 6}
				>
					Submit
				</button>
			</form>
			<p className='self-center'>Didn&#39;t get the code? <a className='font-semibold text-blue-500 hover:underline cursor-pointer' onClick={sendCode}>Resend code</a></p>
		</>
	);
}
