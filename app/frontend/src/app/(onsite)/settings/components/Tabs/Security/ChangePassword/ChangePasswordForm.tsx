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
	onCancel: () => void;
	onSuccess: () => void;
}

export default function ChangePasswordForm({
	onCancel,
	onSuccess
} : ChangePasswordFormProps) {
	const t = useTranslations('');
	const tmodal = useTranslations('settings.security.cards.change_password.modal');
	const tautherr = useTranslations('auth');

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
			// setCanSave(false);
			return;
		}

		// setCanSave(true);
	}, [formData, errors, debounced, touched]);
	// }, [formData, errors, debounced, touched, setCanSave]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		console.group('handleSubmit ChangePasswordForm');
		console.log('You just called handleSubmit of ChangePasswordForm');
		console.groupEnd();

		const isValid = validateAll();
		if (!isValid) return;

		try {
			// setIsSubmitting(true);
			await simulateBackendCall(1000);
			// await executeAPICall(() => apiClient.auth.changePassword(
			// 	formData.current_password,
			// 	formData.new_password
			// ));

			toastSuccess('Password changed successfully');
			onSuccess();
		} catch (err: any) {
			if (err.message === 'AUTH_INVALID_CREDENTIALS') err.message = 'AUTH_INVALID_CURRENT_PASSWORD';
			toastError(tautherr('errorCodes', { code: err.message }));
		} finally {
			// setIsSubmitting(false);
			resetForm();
		}
	}

	return (
		<div>
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
						resetForm={resetForm}
					>
						<form onSubmit={handleSubmit} className='flex flex-col gap-5'>
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
			</div>

			{/* ACTION BUTTONS */}
			<div className='flex w-full mt-16 gap-4'>
				<button className='flex-1 bg-white/4 hover:bg-white/10 border border-white/10
								flex gap-2 justify-center items-center px-3 md:px-5 py-0 md:py-1.5 text-sm md:text-base
								rounded-full h-10 select-none font-medium
								transition-all duration-500 ease-in-out cursor-pointer'
						onClick={onCancel}
				>
					{tmodal('button1')}
				</button>
				<button className='flex-1 bg-blue-500/10 hover:bg-blue-500/60 border border-blue-500/20 text-white
								flex gap-2 justify-center items-center px-3 md:px-5 py-0 md:py-1.5 text-sm md:text-base
								rounded-full h-10 select-none font-medium
								transition-all duration-500 ease-in-out cursor-pointer'
						onClick={() => alert('DEV - DELETE ACCOUNT')}
				>
					{tmodal('button2')}
				</button>
			</div>
		</div>
	);
}
