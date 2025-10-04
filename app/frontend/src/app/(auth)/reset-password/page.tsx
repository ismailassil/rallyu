'use client';
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ForgotPassword } from "./components/ForgotPassword";
import { CheckEmail } from "./components/CheckEmail";
import { SetNewPassword } from "./components/SetNewPassword";
import useForm from "@/app/hooks/useForm";
import { resetPasswordSchema } from "@/app/(api)/schema";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import { APIError } from "@/app/(api)/APIClient";
import AuthPageWrapper from "../components/shared/ui/AuthPageWrapper";

enum STEP {
	FORGOT_PASSWORD = 'FORGOT',
	CHECK_EMAIL = 'CHECK-EMAIL',
	SUBMIT_NEW_PASSWORD = 'SUBMIT-NEW-PASSWORD'
}

export default function ResetPasswordPage() {
	const router = useRouter();
	const { apiClient } = useAuth();
	const [step, setStep] = useState<STEP>(STEP.FORGOT_PASSWORD);
	const [code, setCode] = useState(['', '', '', '', '', '']);
	const [isLoading, setIsLoading] = useState(false);
	const inputRefs = useRef([]);
	const [formData, touched, errors, debounced, handleChange, validateAll] = useForm(
		resetPasswordSchema,
		{ email: '', password: '', confirm_password: '' },
		{ debounceMs: { email: 1200, username: 1200, password: 1200 } }
	);

	async function handleRequestPasswordReset() {
		validateAll();

		if (formData.email === '')
			return ;
		if (errors.email)
			return ;

		try {
			setIsLoading(true);
			await apiClient.requestPasswordReset(formData.email);
			toastSuccess('Code sent!');
			setStep(STEP.CHECK_EMAIL);
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.message);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleVerifyCode() {
		try {
			setIsLoading(true);
			const codeStr = code.join('');
			await apiClient.verifyPasswordResetCode({ email: formData.email, code: codeStr });
			toastSuccess('Code verified!');
			setStep(STEP.SUBMIT_NEW_PASSWORD);
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.message);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleSetNewPassword() {
		validateAll();

		if (formData.password === '' || formData.confirm_password === '')
			return ;
		if (errors.password || errors.confirm_password)
			return ;

		try {
			setIsLoading(true);
			await apiClient.resetPassword({ email: formData.email, code: code.join(''), newPassword: formData.password });
			toastSuccess('Password updated successfully!');
			router.replace('/login');
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.message);
		} finally {
			setIsLoading(false);
		}
	}



	function renderCurrentStep() {
		switch (step) {
			case STEP.FORGOT_PASSWORD:
				return (
					<ForgotPassword 
						email={formData.email} 
						error={errors.email} 
						onSubmit={handleRequestPasswordReset}
						onChange={handleChange} 
						onGoBack={() => router.push('/login')} 
					/>
				);
			case STEP.CHECK_EMAIL:
				return (
					<CheckEmail 
						code={code} 
						setCode={setCode} 
						inputRefs={inputRefs} 
						isResendingCode={isLoading}
						isVerifyingCode={isLoading}
						onVerify={handleVerifyCode}
						onResend={handleRequestPasswordReset}
						onGoBack={() => setStep(STEP.FORGOT_PASSWORD)}
					/>
				);
			case STEP.SUBMIT_NEW_PASSWORD:
				return (
					<SetNewPassword 
						formData={formData} 
						errors={errors} 
						debounced={debounced} 
						touched={touched} 
						onChange={handleChange}
						onSubmit={handleSetNewPassword}
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
