'use client';
import React from 'react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { toastError } from '../../../components/CustomToast';
import { useRouter } from 'next/navigation';
import InputField from '../../components/Form/InputField';
import useForm from '@/app/hooks/useForm';
import PasswordStrengthIndicator from '../../components/Form/PasswordStrengthIndicator';
import FormButton from '../../components/UI/FormButton';
import { LogIn } from 'lucide-react';
import { FormProvider } from '../../components/Form/FormContext';
import AvailabilityIndicator from '../../components/Form/AvailabilityIndicator';
import useAPICall from '@/app/hooks/useAPICall';
import useAvailabilityCheck from '@/app/hooks/useAvailabilityCheck';
import { useTranslations } from 'next-intl';
import useValidationSchema from '@/app/hooks/useValidationSchema';

export default function SignUpForm() {
	const t = useTranslations('auth.common');
	const tautherr = useTranslations('auth');

	const router = useRouter();

	const { apiClient } = useAuth();

	const { isLoading, executeAPICall } = useAPICall();

	const { signupFormSchema } = useValidationSchema();

	const [
		formData,
		touched,
		errors,
		debounced,
		handleChange,
		validateAll,
		getValidationErrors,
		resetForm,
	] = useForm(
		signupFormSchema,
		{ first_name: '', last_name: '', username: '', email: '', password: '' },
		{ debounceMs: { email: 1200, username: 1200, password: 1200 } }
	);

	const { status: usernameStatus, setStatus: setUsernameStatus } = useAvailabilityCheck(
		'username',
		formData.username,
		null,
		debounced.username,
		errors.username
	);
	const { status: emailStatus, setStatus: setEmailStatus } = useAvailabilityCheck(
		'email',
		formData.email,
		null,
		debounced.email,
		errors.email
	);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const isValid = validateAll();
		if (!isValid) return;
		if (
			!(
				debounced.username &&
				usernameStatus === 'available' &&
				debounced.email &&
				emailStatus === 'available'
			)
		)
			return;

		try {
			await executeAPICall(() =>
				apiClient.auth.register(
					formData.first_name,
					formData.last_name,
					formData.username,
					formData.email,
					formData.password
				)
			);
			router.push('/login');
		} catch (err: any) {
			if (err.message === 'AUTH_USERNAME_TAKEN') setUsernameStatus('unavailable');
			else if (err.message === 'AUTH_EMAIL_TAKEN') setEmailStatus('unavailable');
			else toastError(tautherr('errorCodes', { code: err.message }));
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
				<div className='flex flex-col gap-5 sm:flex-row sm:gap-2'>
					<InputField
						className='field flex min-w-0 flex-1 flex-col gap-0.5'
						iconSrc='/icons/firstname.svg'
						label={t('first_name')}
						field='first_name'
						inputPlaceholder='Achraf'
						autoFocus
					/>
					<InputField
						className='field flex min-w-0 flex-1 flex-col gap-0.5'
						iconSrc='/icons/lastname.svg'
						label={t('last_name')}
						field='last_name'
						inputPlaceholder='Demnati'
					/>
				</div>
				<InputField
					className='field box-border flex flex-col gap-0.5'
					iconSrc='/icons/at.svg'
					label={t('username')}
					field='username'
					inputPlaceholder='xezzuz'
				>
					{debounced.username && !errors.username && (
						<AvailabilityIndicator
							key='username-availability'
							label={t('username')}
							status={usernameStatus}
						/>
					)}
				</InputField>
				<InputField
					className='field box-border flex flex-col gap-0.5'
					iconSrc='/icons/mail.svg'
					label={t('email')}
					field='email'
					inputPlaceholder='iassil@1337.student.ma'
				>
					{debounced.email && !errors.email && (
						<AvailabilityIndicator
							key='email-availability'
							label={t('email')}
							status={emailStatus}
						/>
					)}
				</InputField>
				<InputField
					className='field box-border flex flex-col gap-0.5'
					iconSrc='/icons/lock.svg'
					label={t('password')}
					field='password'
					inputPlaceholder='••••••••••••••••'
					inputHidden={true}
				>
					{formData.password && (
						<PasswordStrengthIndicator
							key='password-strength'
							value={formData.password}
						/>
					)}
				</InputField>
				<FormButton
					text={t('signup')}
					icon={<LogIn size={16} />}
					type='submit'
					isSubmitting={isLoading}
				/>
			</form>
		</FormProvider>
	);
}
