import { phoneSchema } from '@/app/(api)/schema';
import { FormProvider } from '@/app/(auth)/components/Form/FormContext';
import InputField from '@/app/(auth)/components/Form/InputField';
import FormButton from '@/app/(auth)/components/UI/FormButton';
import useForm from '@/app/hooks/useForm';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import useAPICall from '@/app/hooks/useAPICall';
import { toastError, toastSuccess } from '@/app/components/CustomToast';

const META = {
	PHONE: {
		title: 'SMS',
		description: 'Receive codes via SMS'
	},
	EMAIL: {
		title: 'Email',
		description: 'Receive codes via Email'
	}
};

export default function VerifyPhone() {
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
		phoneSchema,
		{ phone: '' },
		{ debounceMs: { phone: 1200 } }
	);

	const {
		apiClient
	} = useAuth();

	const {
		isLoading,
		executeAPICall
	} = useAPICall();

	async function handleSubmit() {
		const isValid = validateAll();
		if (!isValid)
			return ;

		try {
			await executeAPICall(() => apiClient.auth.requestVerifyPhone(formData.phone));
			toastSuccess('Code sent');
		} catch (err: any) {
			toastError(err.message);
		}
	}

	return (
		<div className="w-full max-w-lg p-11 flex flex-col gap-5 select-none">
			{/* Header + Go Back */}
			<div className="flex gap-4 items-center mb-2">
				<button
					onClick={undefined}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='font-semibold text-lg sm:text-3xl inline-block'>Phone number</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>We&#39;ll send you a 6-digit verification code</p>
				</div>
			</div>

			{/* Phone Input + Continue Button */}
			<div className="flex flex-col gap-3">
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
					field='phone'
					inputPlaceholder='+212636299820'
				/>
				</FormProvider>
				<FormButton
					text='Continue'
					icon={<ArrowRight size={16} />}
					onClick={handleSubmit}
					isSubmitting={isLoading}
				/>
			</div>
			{/* <p className='self-center mt-2'>Remember your password? <span onClick={() => router.push('/signup')} className='font-semibold text-blue-500 hover:underline cursor-pointer'>Sign in</span></p> */}
		</div>
	);
}
