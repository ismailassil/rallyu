'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ForgotPassword } from "./components/ForgotPassword";
import { VerifyCode } from "./components/VerifyCode";
import { SetNewPassword } from "./components/SetNewPassword";
import AuthPageWrapper from "../components/UI/AuthPageWrapper";

enum STEP {
	FORGOT_PASSWORD = 'FORGOT-PASSWORD',
	VERIFY_CODE = 'VERIFY-CODE',
	SET_NEW_PASSWORD = 'SET-NEW-PASSWORD'
}

export default function ResetPasswordPage() {
	const router = useRouter();
	const [step, setStep] = useState<STEP>(STEP.FORGOT_PASSWORD);
	const [token, setToken] = useState<string | null>(null);

	function renderCurrentStep() {
		switch (step) {
			case STEP.FORGOT_PASSWORD:
				return (
					<ForgotPassword
						onNext={(token: string) => {
							setToken(token);
							setStep(STEP.VERIFY_CODE);
						}}
						onGoBack={() => router.push('/login')}
					/>
				);
			case STEP.VERIFY_CODE:
				return (
					<VerifyCode
						token={token!}
						onSuccess={() => setStep(STEP.SET_NEW_PASSWORD)}
						onFailure={() => router.replace('/login')}
						onGoBack={() => setStep(STEP.FORGOT_PASSWORD)}
					/>
				);
			case STEP.SET_NEW_PASSWORD:
				return (
					<SetNewPassword
						token={token!}
						onSuccess={() => router.push('/login')}
					/>
				);
			default:
				return null;
		}
	}

	return (
		<AuthPageWrapper wrapperKey="reset-password-page-wrapper">
			{renderCurrentStep()}
		</AuthPageWrapper>
	);
}
