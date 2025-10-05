'use client';
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ForgotPassword } from "./components/ForgotPassword";
import { VerifyCode } from "./components/VerifyCode";
import { SetNewPassword } from "./components/SetNewPassword";
import useForm from "@/app/hooks/useForm";
import { resetPasswordSchema } from "@/app/(api)/schema";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import { APIError } from "@/app/(api)/APIClient";
import AuthPageWrapper from "../components/shared/ui/AuthPageWrapper";
import { FormProvider } from "../components/shared/form/FormContext";

enum STEP {
	FORGOT_PASSWORD = 'FORGOT-PASSWORD',
	VERIFY_CODE = 'VERIFY-CODE',
	SET_NEW_PASSWORD = 'SET-NEW-PASSWORD'
}

export default function ResetPasswordPage() {
	const router = useRouter();
	const { apiClient } = useAuth();
	const [step, setStep] = useState<STEP>(STEP.FORGOT_PASSWORD);
	const [code, setCode] = useState(['', '', '', '', '', '']);
	const [isLoading, setIsLoading] = useState(false);
	const inputRefs = useRef([]);
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

	async function handleRequestPasswordReset() {
		const isValid = validateAll();
		if (!isValid && errors.email)
			return ;

		try {
			setIsLoading(true);
			await apiClient.requestPasswordReset(formData.email);
			toastSuccess('Code sent!');
			setStep(STEP.VERIFY_CODE);
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
			setStep(STEP.SET_NEW_PASSWORD);
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
