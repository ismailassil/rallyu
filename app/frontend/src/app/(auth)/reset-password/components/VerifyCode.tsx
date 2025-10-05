/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ArrowLeft, ArrowRight } from "lucide-react";
import OTPCodeInput from "@/app/(onsite)/2fa/components/OTPCodeInput";
import { useRef, useState } from "react";
import FormButton from "../../components/shared/ui/FormButton";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import useAPICall from "@/app/hooks/useAPICall";
import { useFormContext } from "../../components/shared/form/FormContext";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import InputFieldError from "../../components/shared/form/InputFieldError";
import { AnimatePresence } from "framer-motion";

interface VerifyCodeProps {
	onNext: () => void;
	onGoBack: () => void;
}

export function VerifyCode({ onNext, onGoBack } : VerifyCodeProps) {
	const router = useRouter();

	const {
		apiClient
	} = useAuth();

	const { 
		isLoading, 
		executeAPICall 
	} = useAPICall();

	const {
		formData, 
		errors, 
		handleChange, 
		validateAll,
		getValidationErrors,
	} = useFormContext();

	const [isResending, setIsResending] = useState<boolean>(false);
	const [code, setCode] = useState(['', '', '', '', '', '']);
	const inputRefs = useRef([]);

	async function handleSubmit() {
		validateAll();
		const errors = getValidationErrors();
		if (errors?.code)
			return ;

		try {
			await executeAPICall(() => apiClient.verifyPasswordResetCode({ email: formData.email, code: formData.code }));
			toastSuccess('Code verified!');
			onNext();
		} catch (err: any) {
			toastError(err.message);
		}
	}

	async function handleResend() {
		if (!formData.email)
			router.refresh();

		setIsResending(true);
		try {
			await executeAPICall(() => apiClient.requestPasswordReset(
				formData.email
			));
			toastSuccess('Code sent!');
		} catch (err: any) {
			toastError(err.message);
		} finally {
			setIsResending(false);
		}
	}

	return (
		<>
			{/* Header + Go Back */}
			<div className="flex gap-4 items-center mb-8">
				<button 
					onClick={onGoBack}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='font-semibold text-lg sm:text-3xl inline-block'>Check your Email!</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>We&#39;ve sent a 6-digit code to your email address</p>
				</div>
			</div>

			{/* OTP Input + Verify Button + Resend Button */}
			<div className="flex flex-col gap-6">
				<OTPCodeInput 
					code={code}
					setCode={(newCode) => {
						setCode(newCode);
						const fakeChangeEvent = {
							target: {
								name: 'code',
								value: newCode.join('')
							}
						} as React.ChangeEvent<HTMLInputElement>;
						handleChange(fakeChangeEvent);
					}}
					inputRefs={inputRefs}
					isDisabled={isLoading}
				><AnimatePresence>{errors.code && <InputFieldError error={errors.code} />}</AnimatePresence></OTPCodeInput>

				<FormButton
					text='Continue'
					icon={<ArrowRight size={16} />}
					onClick={handleSubmit}
					isSubmitting={isLoading && !isResending}
					disabled={isResending}
				/>

				<p className='self-center'>
					Didn&#39;t receive the code? 
					<span 
						onClick={handleResend}
						className={`font-semibold ml-1 ${
							(isLoading) 
								? 'text-gray-500 cursor-not-allowed pointer-events-none' 
								: 'text-blue-500 hover:underline cursor-pointer'
						}`}
					>
						Resend code
					</span>
				</p>
			</div>
		</>
	);
}
