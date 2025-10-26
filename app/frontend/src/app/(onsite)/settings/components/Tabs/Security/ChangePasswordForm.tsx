import React, { RefObject, useEffect } from 'react';
import InputField from '@/app/(auth)/components/Form/InputField';
import { FormProvider } from '@/app/(auth)/components/Form/FormContext';
import useForm from '@/app/hooks/useForm';
import { toastError, toastSuccess } from '@/app/components/CustomToast';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { Check, Lock } from 'lucide-react';
import useAPICall from '@/app/hooks/useAPICall';
import { useTranslations } from 'next-intl';
import useValidationSchema from '@/app/hooks/useValidationSchema';
import { simulateBackendCall } from '@/app/(api)/utils';

interface ChangePasswordFormProps {
	formRef: RefObject<HTMLFormElement | null>;
	setIsSubmitting: (bool: boolean) => void;
	setCanSave: (bool: boolean) => void;
	onSuccess: () => void;
}

export default function ChangePasswordForm({
	formRef,
	setCanSave,
	setIsSubmitting,
	onSuccess
} : ChangePasswordFormProps) {
	const t = useTranslations('');

	const {
		apiClient
	} = useAuth();

	const {
		executeAPICall
	} = useAPICall();

	const {
		changePasswordSchema
	} = useValidationSchema();

	const [
		formData,
		touched,
		errors,
		debounced,
		handleChange,
		validateAll,
		getValidationErrors,
		resetForm,
	] = useForm(changePasswordSchema,
		{ current_password: '', new_password: '', confirm_new_password: '' }, {
			debounceMs: 1200,
			fieldsDependencies: {
				new_password: ['confirm_new_password', 'current_password'],
        		current_password: ['new_password']
			}
		}
	);

	useEffect(() => {
		const hasErrors = Object.keys(errors).length > 0;
		const allTouched =
			Object.keys(touched).length === Object.keys(formData).length &&
			Object.values(touched).every((t) => t === true);
		const allDebounced =
			Object.keys(debounced).length === Object.keys(formData).length &&
			Object.values(debounced).every((d) => d === true);
		const allFilled = Object.values(formData).every((v) => v !== '');

		if (hasErrors || !allTouched || !allFilled || !allDebounced) {
			setCanSave(false);
			return;
		}

		setCanSave(true);
	}, [formData, errors, debounced, touched, setCanSave]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		console.group('handleSubmit ChangePasswordForm');
		console.log('You just called handleSubmit of ChangePasswordForm');
		console.groupEnd();

		const isValid = validateAll();
		if (!isValid) return;

		try {
			setIsSubmitting(true);
			// await executeAPICall(() =>
			// 	apiClient.auth.changePassword(formData.current_password, formData.new_password)
			// );
			await simulateBackendCall(1000);

			toastSuccess('Password changed successfully');
			onSuccess();
		} catch (err: any) {
			toastError(err.message || 'Something went wrong, please try again later');
		} finally {
			setIsSubmitting(false);
			resetForm();
		}
	}

	return (
		<div className='flex flex-col gap-8 lg:flex-row'>
			{/* Form Section */}
			<div className='order-2 lg:order-1 lg:flex-1'>
				<FormProvider
					formData={formData}
					touched={touched}
					errors={errors}
					debounced={debounced}
					handleChange={handleChange}
					getValidationErrors={getValidationErrors}
					validateAll={validateAll}
				>
					<form ref={formRef} onSubmit={handleSubmit} className='flex flex-col gap-5'>
						<InputField
							className='field box-border flex flex-col gap-0.5'
							iconSrc='/icons/lock.svg'
							label={t('auth.common.current_password')}
							field='current_password'
							inputPlaceholder='••••••••••••••••'
							inputHidden={true}
						/>
						<InputField
							className='field box-border flex flex-col gap-0.5'
							iconSrc='/icons/lock.svg'
							label={t('auth.common.new_password')}
							field='new_password'
							inputPlaceholder='••••••••••••••••'
							inputHidden={true}
						/>
						<InputField
							className='field box-border flex flex-col gap-0.5'
							iconSrc='/icons/lock.svg'
							label={t('auth.common.confirm_password')}
							field='confirm_new_password'
							inputPlaceholder='••••••••••••••••'
							inputHidden={true}
						/>
					</form>
				</FormProvider>
			</div>

			{/* Rules Section */}
			<div className='order-1 lg:order-2'>
				<div className='h-full rounded-2xl border border-white/6 bg-gradient-to-br from-white/0 to-white/4 p-5 sm:p-6 lg:p-7'>
					<div className='mb-4 flex items-center gap-3'>
						<Lock className='h-5 w-5 shrink-0' />
						<div>
							<h2 className='text-lg font-bold text-white sm:text-xl'>
								{t('settings.security.cards.change_password_form.sidecard.title')}
							</h2>
						</div>
					</div>
					<p className='text-sm text-white/75'>
						{t('settings.security.cards.change_password_form.sidecard.text1')} <br />{' '}
						{t('settings.security.cards.change_password_form.sidecard.text2')}{' '}
					</p>
					<ul className='mt-5 space-y-2.5'>
						<li className='flex items-start gap-2 text-sm text-white/85'>
							<Check className='h-5 w-5 shrink-0' />
							<span>
								{t('settings.security.cards.change_password_form.sidecard.text3')}
							</span>
						</li>
						<li className='flex items-start gap-2 text-sm text-white/85'>
							<Check className='h-5 w-5 shrink-0' />
							<span>
								A{t('settings.security.cards.change_password_form.sidecard.text4')}
							</span>
						</li>
						<li className='flex items-start gap-2 text-sm text-white/85'>
							<Check className='h-5 w-5 shrink-0' />
							<span>
								{t('settings.security.cards.change_password_form.sidecard.text5')}
							</span>
						</li>
						<li className='flex items-start gap-2 text-sm text-white/85'>
							<Check className='h-5 w-5 shrink-0' />
							<span>
								{t('settings.security.cards.change_password_form.sidecard.text6')}
							</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
