/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ArrowLeft, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import FormButton from "../../components/UI/FormButton";
import { useFormContext } from "../../components/Form/FormContext";
import InputField from "../../components/Form/InputField";
import useAPICall from "@/app/hooks/useAPICall";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { toastError, toastSuccess } from "@/app/components/CustomToast";

export function ForgotPassword({ onNext, onGoBack } : { onNext: () => void, onGoBack: () => void }) {
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
		validateAll,
		getValidationErrors,
	} = useFormContext();

	async function handleSubmit() {
		validateAll();
		const errors = getValidationErrors();
		if (errors?.email)
			return ;

		try {
			await executeAPICall(() => apiClient.requestPasswordReset(
				formData.email
			));
			toastSuccess('Code sent!');
			onNext();
		} catch (err: any) {
			toastError(err.message);
		}
	}

	return (
		<>
			{/* Header + Go Back */}
			<div className="flex gap-4 items-center mb-4">
				<button 
					onClick={onGoBack}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='font-semibold text-lg sm:text-3xl inline-block'>Forgot your password?</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>We&#39;ll send you a 6-digit verification code</p>
				</div>
			</div>
			{/* Email */}
			<InputField
				className='field flex flex-col gap-0.5 min-w-0 flex-1'
				iconSrc='/icons/mail.svg'
				label=''
				field='email'
				inputPlaceholder='iassil@1337.student.ma'
			/>
			<FormButton
				text='Reset Password'
				icon={<RotateCw size={16} />}
				onClick={handleSubmit}
				isSubmitting={isLoading}
			/>
			<p className='self-center'>Remember your password? <span onClick={() => router.push('/signup')} className='font-semibold text-blue-500 hover:underline cursor-pointer'>Sign in</span></p>
		</>
	);
}
