'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ForgotPassword } from "./components/ForgotPassword";
import { CheckEmail } from "./components/CheckEmail";
import { SetNewPassword } from "./components/SetNewPassword";

export default function ResetPasswordPage() {
	const [email, setEmail] = useState('');
	const [code, setCode] = useState('');
	const [step, setStep] = useState<'forgot' | 'check' | 'new'>('forgot');
	const router = useRouter();

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
