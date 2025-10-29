import React from 'react';
import InputField from '@/app/(auth)/components/Form/InputField';
import { FormProvider } from '@/app/(auth)/components/Form/FormContext';
import useForm from '@/app/hooks/useForm';
import { toastError } from '@/app/components/CustomToast';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import useAPICall from '@/app/hooks/useAPICall';
import { useTranslations } from 'next-intl';
import useValidationSchema from '@/app/hooks/useValidationSchema';

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
		executeAPICall,
		isLoading: isSubmitting
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

	async function handleSubmit() {
		const isValid = validateAll();
		if (!isValid) return;

		try {
			await executeAPICall(() => apiClient.auth.changePassword(
				formData.current_password,
				formData.new_password
			));

			onSuccess();
		} catch (err: any) {
			if (err.message === 'AUTH_INVALID_CREDENTIALS') err.message = 'AUTH_INVALID_CURRENT_PASSWORD';
			toastError(tautherr('errorCodes', { code: err.message }));
		} finally {
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
						<form className='flex flex-col gap-5'>
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
				<button className={`flex-1 bg-white/4 hover:bg-white/10 border border-white/10
								flex gap-2 justify-center items-center px-3 md:px-5 py-0 md:py-1.5 text-sm md:text-base
								rounded-full h-10 select-none font-medium
								transition-all duration-500 ease-in-out ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
						onClick={onCancel}
						disabled={isSubmitting}
				>
					{tmodal('button1')}
				</button>
				<button className={`flex-1 bg-blue-500/10 hover:bg-blue-500/60 border border-blue-500/20 text-white
								flex gap-2 justify-center items-center px-3 md:px-5 py-0 md:py-1.5 text-sm md:text-base
								rounded-full h-10 select-none font-medium
								transition-all duration-500 ease-in-out ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
						onClick={handleSubmit}
						disabled={isSubmitting}
				>
					{tmodal('button2')}
				</button>
			</div>
		</div>
	);
}
