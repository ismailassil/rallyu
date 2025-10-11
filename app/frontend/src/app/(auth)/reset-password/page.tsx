'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ForgotPassword } from "./components/ForgotPassword";
import { VerifyCode } from "./components/VerifyCode";
import { SetNewPassword } from "./components/SetNewPassword";
import AuthPageWrapper from "../components/UI/AuthPageWrapper";
// import { FormProvider } from "../components/Form/FormContext";

enum STEP {
	FORGOT_PASSWORD = 'FORGOT-PASSWORD',
	VERIFY_CODE = 'VERIFY-CODE',
	SET_NEW_PASSWORD = 'SET-NEW-PASSWORD'
}

export default function ResetPasswordPage() {
	const router = useRouter();
	const [step, setStep] = useState<STEP>(STEP.FORGOT_PASSWORD);
	const [token, setToken] = useState<string | null>(null);
	const [email, setEmail] = useState<string | null>(null);

	function renderCurrentStep() {
		switch (step) {
			case STEP.FORGOT_PASSWORD:
				return (
					<ForgotPassword
						onNext={(token: string, email: string) => {
							setToken(token);
							setEmail(email);
							setStep(STEP.VERIFY_CODE);
						}}
						onGoBack={() => router.push('/login')}
					/>
				);
			case STEP.VERIFY_CODE:
				return (
					<VerifyCode
						email={email!}
						token={token!}
						onNext={() => setStep(STEP.SET_NEW_PASSWORD)}
						onGoBack={() => setStep(STEP.FORGOT_PASSWORD)}
					/>
				);
			case STEP.SET_NEW_PASSWORD:
				return (
					<SetNewPassword
						token={token!}
						onNext={() => router.push('/login')}
					/>
				);
			default:
				return null;
		}
	}

	return (
		<AuthPageWrapper wrapperKey="reset-password-page-wrapper">
			<div className='w-full max-w-lg p-11 flex flex-col gap-5'>
				{renderCurrentStep()}
			</div>
		</AuthPageWrapper>
	);
}
