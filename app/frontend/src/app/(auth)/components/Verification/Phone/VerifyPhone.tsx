/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormProvider } from '@/app/(auth)/components/Form/FormContext';
import InputField from '@/app/(auth)/components/Form/InputField';
import FormButton from '@/app/(auth)/components/UI/FormButton';
import useForm from '@/app/hooks/useForm';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React from 'react';
import useAPICall from '@/app/hooks/useAPICall';
import { toastError } from '@/app/components/CustomToast';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import AnimatedComponent from '../../UI/AnimatedComponent';
import NoteBox from '@/app/components/NoteBox';
import { useTranslations } from 'next-intl';
import useValidationSchema from '@/app/hooks/useValidationSchema';


interface VerifyPhoneProps {
	onNext: (token: string) => void;
	onGoBack: () => void;
}

export default function VerifyPhone({ onGoBack, onNext } : VerifyPhoneProps) {
	const t = useTranslations('auth');
	const tvp = useTranslations('auth.verification.input');

	const {
		apiClient,
		loggedInUser
	} = useAuth();

	const {
		phoneOnlySchema
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
		phoneOnlySchema,
		{ phone: loggedInUser!.phone || '' },
		{ debounceMs: { phone: 1200 } }
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
			const { token } = await executeAPICall(() => apiClient.verify.requestPhone(
				formData.phone
			));
			onNext(token);
		} catch (err: any) {
			toastError(tvp('errors.phone', { code: err.message }));
		}
	}

	return (
		<AnimatedComponent componentKey='verify-phone-setup' className="w-full max-w-lg p-11 flex flex-col gap-5 select-none">
			{/* Header + Go Back */}
			<div className="flex gap-4 items-center mb-2">
				<button
					onClick={onGoBack}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='font-semibold text-lg sm:text-3xl inline-block'>{t('verification.input.title', { method: 'SMS' })}</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>{t('verification.input.subtitle', { method: 'SMS' })}</p>
				</div>
			</div>

			{/* Phone Input + Continue Button */}
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
					field='phone'
					inputPlaceholder='+212636299820'
					autoFocus
				/>
				</FormProvider>
				<FormButton
					text={t('common.continue')}
					type='submit'
					icon={<ArrowRight size={16} />}
					isSubmitting={isLoading}
				/>
			</form>

			<NoteBox title={t('verification.note.title')} className='bg-blue-500/6 text-blue-400 md:text-sm mt-2'>
				<br></br>{t('verification.note.first')}<br></br>{t('verification.note.second')}
			</NoteBox>
		</AnimatedComponent>
	);
}
