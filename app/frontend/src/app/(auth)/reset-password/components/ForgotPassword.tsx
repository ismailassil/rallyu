/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ArrowLeft, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import FormButton from "../../components/UI/FormButton";
import InputField from "../../components/Form/InputField";
import useAPICall from "@/app/hooks/useAPICall";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import useForm from "@/app/hooks/useForm";
import { FormProvider } from "../../components/Form/FormContext";
import AnimatedComponent from "../../components/UI/AnimatedComponent";
import { useTranslations } from "next-intl";
import useValidationSchema from "@/app/hooks/useValidationSchema";

export function ForgotPassword({ onNext, onGoBack } : { onNext: (token: string) => void, onGoBack: () => void }) {
	const t = useTranslations('');

	const router = useRouter();

	const {
		emailOnlySchema
	} = useValidationSchema();

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
		emailOnlySchema,
		{ email: '' },
		{ debounceMs: { email: 1200 } }
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
			const { token } = await executeAPICall(() => apiClient.auth.requestPasswordReset(
				formData.email
			));
			toastSuccess('Code sent');
			onNext(token);
		} catch (err: any) {
			toastError(err.message);
		}
	}

	return (
		<AnimatedComponent componentKey="forgot-password" className='w-full max-w-lg p-11 flex flex-col gap-5'>
			{/* Header + Go Back */}
			<div className="flex gap-4 items-center mb-2">
				<button
					onClick={onGoBack}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='font-semibold text-lg sm:text-3xl inline-block'>{t('auth.reset_password.forgotPassword.title')}</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>{t('auth.reset_password.forgotPassword.subtitle')}</p>
				</div>
			</div>

			{/* Email Input + Reset Password Button */}
			<form className="flex flex-col gap-3" onSubmit={handleSubmit}>
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
					className='field flex flex-col gap-0.5 min-w-0 flex-1'
					iconSrc='/icons/mail.svg'
					label=''
					field='email'
					inputPlaceholder='iassil@1337.student.ma'
					autoFocus
				/>
				</FormProvider>
				<FormButton
					text={t('auth.common.reset_password')}
					type="submit"
					icon={<RotateCw size={16} />}
					isSubmitting={isLoading}
				/>
			</form>
			<p className='self-center mt-2'>{t('auth.reset_password.forgotPassword.instruction')} <span onClick={() => router.push('/signup')} className='font-semibold text-blue-500 hover:underline cursor-pointer'>{t('auth.common.signin')}</span></p>
		</AnimatedComponent>
	);
}
