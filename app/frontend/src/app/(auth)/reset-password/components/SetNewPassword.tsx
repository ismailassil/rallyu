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
import AnimatedComponent from "../../components/UI/AnimatedComponent";

export function SetNewPassword({ token, onSuccess } : { token: string, onSuccess: () => void }) {
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

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const isValid = validateAll();
		if (!isValid)
			return ;

		try {
			await executeAPICall(() => apiClient.resetPassword(
				token,
				formData.password
			));
			toastSuccess('Password updated successfully!');
			onSuccess();
		} catch (err: any) {
			toastError(err.message);
		}
	}

	return (
		<AnimatedComponent componentKey="set-new-password" className='w-full max-w-lg p-11 flex flex-col gap-5'>
			{/* Header */}
			<div className="flex gap-4 items-center mb-4">
				<div>
					<h1 className='font-semibold text-lg sm:text-3xl inline-block'>Create a New Password</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>Please enter and confirm your new password</p>
				</div>
			</div>

			<form onSubmit={handleSubmit}>
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
					autoFocus
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
					type="submit"
					icon={<RotateCw size={16} />}
					isSubmitting={isLoading}
				/>
			</form>


			<p className='self-center'>Remember your password? <span onClick={() => router.push('/signup')} className='font-semibold text-blue-500 hover:underline cursor-pointer'>Sign in</span></p>
		</AnimatedComponent>
	);
}
