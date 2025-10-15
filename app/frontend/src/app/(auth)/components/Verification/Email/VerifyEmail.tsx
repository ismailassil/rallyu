import { emailSchema } from '@/app/(api)/schema';
import { FormProvider } from '@/app/(auth)/components/Form/FormContext';
import InputField from '@/app/(auth)/components/Form/InputField';
import FormButton from '@/app/(auth)/components/UI/FormButton';
import useForm from '@/app/hooks/useForm';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React from 'react';
import useAPICall from '@/app/hooks/useAPICall';
import { toastError, toastSuccess } from '@/app/components/CustomToast';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import AnimatedComponent from '../../UI/AnimatedComponent';
import { APIError } from '@/app/(api)/APIClient';
import NoteBox from '@/app/components/NoteBox';
import { useTranslations } from 'next-intl';


interface VerifyEmailProps {
	onNext: (token: string) => void;
	onGoBack: () => void;
}

export default function VerifyEmail({ onGoBack, onNext } : VerifyEmailProps) {
	const t = useTranslations('auth.verification');

	const {
		apiClient,
		loggedInUser
	} = useAuth();

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
		emailSchema,
		{ email: loggedInUser!.email || '' },
		{ debounceMs: { email: 1200 } }
	);

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
			const { token } = await executeAPICall(() => apiClient.verify.requestEmail(
				formData.email
			));
			toastSuccess('Code sent');
			onNext(token);
		} catch (err) {
			toastError((err as APIError).message);
		}
	}

	return (
		<AnimatedComponent className='w-full max-w-lg p-11 flex flex-col gap-5 select-none' componentKey='verify-email-setup'>
				{/* Header + Go Back */}
				<div className="flex gap-4 items-center mb-2">
					<button
						onClick={onGoBack}
						className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
						<ArrowLeft size={40} />
					</button>
					<div>
						<h1 className='font-semibold text-lg sm:text-3xl inline-block'>{t('input.title', { method: 'EMAIL' })}</h1>
						<p className='text-gray-300 text-sm sm:text-balance'>{t('input.subtitle', { method: 'EMAIL' })}</p>
					</div>
				</div>

				{/* Email Input + Continue Button */}
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
						inputPlaceholder='iassil@student.1337.ma'
						autoFocus
					/>
					</FormProvider>
					<FormButton
						text='Continue'
						type='submit'
						icon={<ArrowRight size={16} />}
						isSubmitting={isLoading}
					/>
				</form>

				<NoteBox title={t('note.title')} className='bg-blue-500/6 text-blue-400 md:text-sm mt-2'>
					<br></br>{t('note.first')}<br></br>{t('note.second')}
				</NoteBox>
		</AnimatedComponent>
	);
}
