import React, { useEffect } from "react";
import InputField from "@/app/(auth)/components/Form/InputField";
import { FormProvider } from "@/app/(auth)/components/Form/FormContext";
import useForm from "@/app/hooks/useForm";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { Check, Lock } from "lucide-react";
import useAPICall from "@/app/hooks/useAPICall";
import { useTranslations } from "next-intl";
import useValidationSchema from "@/app/hooks/useValidationSchema";

interface ChangePasswordFormProps {
	formId: string;
	setButtonDisabled: (disabled: boolean) => void;
	setButtonHidden: (hidden: boolean) => void;
}

export default function ChangePasswordForm({ formId, setButtonDisabled, setButtonHidden } : ChangePasswordFormProps) {
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
		resetForm
	] = useForm(
		changePasswordSchema,
		{ current_password: '', new_password: '', confirm_new_password: '' }
	);

	useEffect(() => {
		const hasErrors = Object.keys(errors).length > 0;
		const allTouched = Object.keys(touched).length === Object.keys(formData).length && Object.values(touched).every(t => t === true);
		const allDebounced = Object.keys(debounced).length === Object.keys(formData).length && Object.values(debounced).every(d => d === true);
		const allFilled = Object.values(formData).every(v => v !== '');

		if (hasErrors || !allTouched || !allFilled || !allDebounced)
			return ;

		setButtonHidden(false);
	}, [formData, errors, debounced, touched, setButtonHidden]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const isValid = validateAll();
		if (!isValid)
			return ;

		try {
			setButtonDisabled(true);
			await executeAPICall(() => apiClient.auth.changePassword(
				formData.current_password,
				formData.new_password
			));

			toastSuccess('Password changed successfully');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toastError(err.message || 'Something went wrong, please try again later');
		} finally {
			setButtonDisabled(false);
			resetForm();
		}
	}

	return (
		<div className="flex flex-col lg:flex-row gap-8">
			{/* Form Section */}
			<div className="order-2 lg:order-1 lg:flex-1">
				<FormProvider
					formData={formData}
					touched={touched}
					errors={errors}
					debounced={debounced}
					handleChange={handleChange}
					getValidationErrors={getValidationErrors}
					validateAll={validateAll}
				>
					<form
						id={formId}
						onSubmit={handleSubmit}
						className="flex flex-col gap-5"
					>
						<InputField
							className='field flex flex-col gap-0.5 box-border'
							iconSrc='/icons/lock.svg'
							label={t('auth.common.current_password')}
							field='current_password'
							inputPlaceholder='••••••••••••••••'
							inputHidden={true}
						/>
						<InputField
							className='field flex flex-col gap-0.5 box-border'
							iconSrc='/icons/lock.svg'
							label={t('auth.common.new_password')}
							field='new_password'
							inputPlaceholder='••••••••••••••••'
							inputHidden={true}
						/>
						<InputField
							className='field flex flex-col gap-0.5 box-border'
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
			<div className="order-1 lg:order-2">
				<div className='bg-gradient-to-br from-white/0 to-white/4 border border-white/6 rounded-2xl p-5 sm:p-6 lg:p-7 h-full'>
					<div className="flex items-center gap-3 mb-4">
						<Lock className="w-5 h-5 shrink-0" />
						<div>
							<h2 className="font-bold text-lg sm:text-xl text-white">{t('settings.security.cards.change_password_form.sidecard.title')}</h2>
						</div>
					</div>
					<p className="text-sm text-white/75">{t('settings.security.cards.change_password_form.sidecard.text1')} <br /> {t('settings.security.cards.change_password_form.sidecard.text2')} </p>
					<ul className="space-y-2.5 mt-5">
						<li className="flex items-start gap-2 text-sm text-white/85">
							<Check className="w-5 h-5 shrink-0" />
							<span>{t('settings.security.cards.change_password_form.sidecard.text3')}</span>
						</li>
						<li className="flex items-start gap-2 text-sm text-white/85">
							<Check className="w-5 h-5 shrink-0" />
							<span>A{t('settings.security.cards.change_password_form.sidecard.text4')}</span>
						</li>
						<li className="flex items-start gap-2 text-sm text-white/85">
							<Check className="w-5 h-5 shrink-0" />
							<span>{t('settings.security.cards.change_password_form.sidecard.text5')}</span>
						</li>
						<li className="flex items-start gap-2 text-sm text-white/85">
							<Check className="w-5 h-5 shrink-0" />
							<span>{t('settings.security.cards.change_password_form.sidecard.text6')}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
