/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useEffect, useState } from "react";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/Loading";
import { ForgotPassword } from "./components/ForgotPassword";
import { CheckEmail } from "./components/CheckEmail";
import { SetNewPassword } from "./components/SetNewPassword";

export default function ResetPasswordPage() {
	const [step, setStep] = useState<'forgot' | 'check' | 'new'>('forgot');
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [code, setCode] = useState('');
	// const [newPassword, setNewPassword] = useState('');

	useEffect(() => {
		console.log('useEffect in /reset-password');
		console.log('isLoading: ', isLoading);
		console.log('isAuthenticated: ', isAuthenticated);
		if (!isLoading && isAuthenticated)
			router.replace('/dashboard');
	}, [isLoading, isAuthenticated]);

	if (isLoading) {
		return (
			<main className="pt-30 flex h-[100vh] w-full pb-10 justify-center items-center">
				<LoadingSpinner />
			</main>
		);
	}


	return (
		<>
			<main className="pt-30 flex h-[100vh] w-full pb-10">
				<div className="flex h-full w-full justify-center overflow-auto">
					<div className="mine flex h-full w-[650px] items-start justify-center pb-20 pl-10 pr-10 pt-20 lg:items-center">
						<div className='rounded-[0px] max-w-[550px] w-full p-9 sm:p-18
									flex flex-col gap-5'>
							{step === 'forgot' && <ForgotPassword email={email} setEmail={setEmail} onValidSubmit={ () => setStep('check') } />}
							{step === 'check' && <CheckEmail email={email} code={code} setCode={setCode} onValidSubmit={ () => setStep('new') } />}
							{step === 'new' && <SetNewPassword email={email} code={code} onValidSubmit={ () => router.replace('/login') }/>}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
