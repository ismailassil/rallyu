'use client';
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ForgotPassword } from "./components/ForgotPassword";
import { CheckEmail } from "./components/CheckEmail";
import { SetNewPassword } from "./components/SetNewPassword";
import { Toaster } from "sonner";
import { motion } from "framer-motion";
import useForm from "@/app/hooks/useForm";
import { resetPasswordSchema, signupFormSchema } from "@/app/(api)/schema";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import { APIError } from "@/app/(api)/APIClient";

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
		<>
			<Toaster position='bottom-right' visibleToasts={1} />
			<motion.div
				key={'reset-password-page'}
				initial={{ opacity: 0, x: -5 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -5 }}
				transition={{ duration: 0.8, delay: 0 }}
			>
				<main className="pt-30 flex h-[100vh] w-full pb-10">
					<div className="flex h-full w-full justify-center overflow-auto">
						<div className="mine flex h-full w-[650px] items-start justify-center pb-20 pl-10 pr-10 pt-20 lg:items-center">
							<div className='rounded-[0px] max-w-[550px] w-full p-9 sm:p-18
										flex flex-col gap-5'>
								{renderCurrentStep()}
							</div>
						</div>
					</div>
				</main>
			</motion.div>
		</>
	);
}
