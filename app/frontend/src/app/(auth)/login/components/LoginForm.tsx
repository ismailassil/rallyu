/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { toastError } from '../../../components/CustomToast';
import { useRouter } from 'next/navigation';
import InputField from '../../components/Form/InputField';
import useForm from '@/app/hooks/useForm';
// import { loginFormSchema } from '@/app/(api)/schema';
import FormButton from '../../components/UI/FormButton';
import { LogIn } from 'lucide-react';
import { FormProvider } from '../../components/Form/FormContext';
import useAPICall from '@/app/hooks/useAPICall';
import { useTranslations } from 'next-intl';
import useValidationSchema from '@/app/hooks/useValidationSchema';

export default function LoginForm() {
	const t = useTranslations('auth.common');
	const tautherr = useTranslations('auth');

	const router = useRouter();

	const {
		login
	} = useAuth();

	const {
		isLoading,
		executeAPICall
	} = useAPICall();

	const {
		loginFormSchema
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
		loginFormSchema,
		{ username: '', password: '' }
	);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const isValid = validateAll();
		if (!isValid)
			return ;

		try {
			const result = await executeAPICall(() => login(formData.username, formData.password));
			if (result._2FARequired)
				router.push('/2fa');
		} catch (err: any) {
			toastError(tautherr('errorCodes', { code: err.message }));
		}
	}

	return (
		<FormProvider
			formData={formData}
			touched={touched}
			errors={errors}
			debounced={debounced}
			handleChange={handleChange}
			validateAll={validateAll}
			getValidationErrors={getValidationErrors}
			resetForm={resetForm}
		>
			<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
				<InputField
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/at.svg'
					label={t('username')}
					field='username'
					inputPlaceholder='xezzuz'
					autoFocus
				/>
				<InputField
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/lock.svg'
					label={t('password')}
					field='password'
					inputPlaceholder='••••••••••••••••'
					inputHidden={true}
				>
					<p className='text-sm text-end hover:underline cursor-pointer'
						onClick={() => router.push('/reset-password')}>
						{t('forgot_password')}?
					</p>
				</InputField>
				<FormButton
					text={t('signin')}
					icon={<LogIn size={16} />}
					type='submit'
					isSubmitting={isLoading}
				/>
			</form>
		</FormProvider>
	);
}
