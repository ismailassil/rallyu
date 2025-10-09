'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ForgotPassword } from "./components/ForgotPassword";
import { VerifyCode } from "./components/VerifyCode";
import { SetNewPassword } from "./components/SetNewPassword";
import useForm from "@/app/hooks/useForm";
import { resetPasswordSchema } from "@/app/(api)/schema";
import AuthPageWrapper from "../components/UI/AuthPageWrapper";
import { FormProvider } from "../components/Form/FormContext";

enum STEP {
	FORGOT_PASSWORD = 'FORGOT-PASSWORD',
	VERIFY_CODE = 'VERIFY-CODE',
	SET_NEW_PASSWORD = 'SET-NEW-PASSWORD'
}

export default function ResetPasswordPage() {
	const router = useRouter();
	const [step, setStep] = useState<STEP>(STEP.FORGOT_PASSWORD);
	const [
		formData, 
		touched, 
		errors, 
		debounced, 
		handleChange, 
		validateAll, 
		getValidationErrors,
		resetForm
	] = useForm(
	resetPasswordSchema,
	{ email: '', code: '', password: '', confirm_password: '' },
	{ debounceMs: { email: 1200, code: 1200, password: 1200, confirm_password: 1200 } }
	);

	function renderCurrentStep() {
		switch (step) {
			case STEP.FORGOT_PASSWORD:
				return (
					<ForgotPassword 
						onNext={() => {
							resetForm({ email: formData.email, code: '', password: '', confirm_password: '' });
							setStep(STEP.VERIFY_CODE);
						}}
						onGoBack={() => router.push('/login')} 
					/>
				);
			case STEP.VERIFY_CODE:
				return (
					<VerifyCode 
						onNext={() => {
							resetForm({ email: formData.email, code: formData.code, password: '', confirm_password: '' });
							setStep(STEP.SET_NEW_PASSWORD);
						}}
						onGoBack={() => setStep(STEP.FORGOT_PASSWORD)}
					/>
				);
			case STEP.SET_NEW_PASSWORD:
				return (
					<SetNewPassword 
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
				<FormProvider
					formData={formData} 
					errors={errors} 
					debounced={debounced} 
					touched={touched} 
					handleChange={handleChange}
					validateAll={validateAll}
					getValidationErrors={getValidationErrors}
					resetForm={resetForm}
				>
					{renderCurrentStep()}
				</FormProvider>
			</div>
		</AuthPageWrapper>
	);
}
