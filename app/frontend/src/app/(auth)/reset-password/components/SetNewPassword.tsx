/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/navigation";
import InputField from "../../components/Form/InputField";
import FormButton from "../../components/UI/FormButton";
import { RotateCw } from "lucide-react";
import useAPICall from "@/app/hooks/useAPICall";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import { confirmPasswordSchema } from "@/app/(api)/schema";
import useForm from "@/app/hooks/useForm";
import { FormProvider } from "../../components/Form/FormContext";

export function SetNewPassword({ token, onNext } : { token: string, onNext: () => void }) {
	const router = useRouter();

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
		confirmPasswordSchema,
		{ password: '', confirm_password: '' },
		{ debounceMs: { password: 1200, confirm_password: 1200 } }
	);

	const {
		apiClient
	} = useAuth();

	const {
		isLoading,
		executeAPICall
	} = useAPICall();

	// const {
	// 	formData,
	// 	validateAll,
	// 	getValidationErrors,
	// } = useFormContext();

	async function handleSubmit() {
		validateAll();
		const errors = getValidationErrors();
		if (errors?.password || errors?.confirm_password)
			return ;

		try {
			await executeAPICall(() => apiClient.resetPassword(
				token,
				formData.password
			));
			toastSuccess('Password updated successfully!');
			onNext();
		} catch (err: any) {
			toastError(err.message);
		}
	}

	return (
		<>
			{/* Header + Go Back */}
			<div className="flex gap-4 items-center mb-4">
				<div>
					<h1 className='font-semibold text-lg sm:text-3xl inline-block'>Create a New Password</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>Please enter and confirm your new password</p>
				</div>
			</div>

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
			<InputField
				className='field flex flex-col gap-0.5 box-border'
				iconSrc='/icons/lock.svg'
				label='Password'
				field='password'
				inputPlaceholder='••••••••••••••••'
				inputHidden={true}
			/>
			<InputField
				className='field flex flex-col gap-0.5 box-border'
				iconSrc='/icons/lock.svg'
				label='Confirm Password'
				field='confirm_password'
				inputPlaceholder='••••••••••••••••'
				inputHidden={true}
			/>
			</FormProvider>
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
