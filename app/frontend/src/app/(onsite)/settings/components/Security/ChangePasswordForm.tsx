// import React, { ChangeEvent, useEffect, useState } from "react";
// import FormField from "@/app/(auth)/components/shared/form/FormField";
// import useForm from "@/app/hooks/useForm";
// import { toastError, toastLoading, toastSuccess } from "@/app/components/CustomToast";
// import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
// import { changePasswordSchema } from "@/app/(api)/schema";
// import { simulateBackendCall } from "@/app/(api)/utils";

// interface ChangePasswordFormProps {
// 	formId: string;
// 	setButtonDisabled: (disabled: boolean) => void;
// 	setButtonHidden: (hidden: boolean) => void;
// }

// export default function ChangePasswordForm({ formId, setButtonDisabled, setButtonHidden } : ChangePasswordFormProps) {
// 	const { apiClient } = useAuth();
// 	const [formData, touched, errors, debounced, handleChange, validateAll, resetForm] = useForm(
// 		changePasswordSchema,
// 		{ current_password: '', new_password: '', confirm_new_password: '' }
// 	);

// 	useEffect(() => {
// 		const hasErrors = Object.keys(errors).length > 0;
// 		const allTouched = Object.keys(touched).length === Object.keys(formData).length && Object.values(touched).every(t => t === true);
// 		const allDebounced = Object.keys(debounced).length === Object.keys(formData).length && Object.values(debounced).every(d => d === true);
// 		const allFilled = Object.values(formData).every(v => v.trim() !== '');

// 		const shouldBeHidden = hasErrors || (!allTouched) || (!allFilled) || (!allDebounced);
// 		console.log('ChangePasswordForm - shouldBeHidden: ', shouldBeHidden, { hasErrors, allTouched, allFilled, allDebounced });
		
// 		setButtonHidden(shouldBeHidden);
// 	}, [formData, errors, debounced, touched, setButtonHidden]);

// 	async function handleSubmit(e: React.FormEvent) {
// 		e.preventDefault();

// 		const isValid = validateAll();
// 		if (!isValid)
// 			return ;

// 		try {
// 			setButtonDisabled(true);
// 			await apiClient.changePassword({ oldPassword: formData.current_password, newPassword: formData.new_password});
// 			toastSuccess('Password changed successfully');
// 		// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 		} catch (err: any) {
// 			toastError(err.message || 'Something went wrong, please try again later');
// 		} finally {
// 			setButtonDisabled(false);
// 			resetForm();
// 		}
// 	}

// 	return (
// 		<div className="flex gap-12 px-14 py-6 max-lg:flex-col max-lg:gap-8 max-lg:px-10">
// 			<form 
// 				id={formId}
// 				onSubmit={handleSubmit}
// 				className="flex flex-col flex-2 gap-4"
// 			>
// 				<FormField 
// 					className='field flex flex-col gap-0.5 box-border'
// 					iconSrc='/icons/lock.svg'
// 					label='Current Password'
// 					field='current_password'
// 					inputPlaceholder='••••••••••••••••'
// 					inputValue={formData.current_password}
// 					hidden={true}
// 					onChange={handleChange}
// 					touched={touched.current_password}
// 					error={errors.current_password}
// 					debounced={debounced.current_password}
// 				/>
// 				<FormField 
// 					className='field flex flex-col gap-0.5 box-border'
// 					iconSrc='/icons/lock.svg'
// 					label='New Password'
// 					field='new_password'
// 					inputPlaceholder='••••••••••••••••'
// 					inputValue={formData.new_password}
// 					hidden={true}
// 					onChange={handleChange}
// 					touched={touched.new_password}
// 					error={errors.new_password}
// 					debounced={debounced.new_password}
// 				/>
// 				<FormField 
// 					className='field flex flex-col gap-0.5 box-border'
// 					iconSrc='/icons/lock.svg'
// 					label='Confirm New Password'
// 					field='confirm_new_password'
// 					inputPlaceholder='••••••••••••••••'
// 					inputValue={formData.confirm_new_password}
// 					hidden={true}
// 					onChange={handleChange}
// 					touched={touched.confirm_new_password}
// 					error={errors.confirm_new_password}
// 					debounced={debounced.confirm_new_password}
// 				/>
// 			</form>
// 			<div className='bg-gradient-to-br from-white/0 to-white/4 border-1 border-white/6 rounded-2xl px-8 py-6 flex-1'>
// 				<h1 className="font-bold text-xl">Rules for passwords</h1>
// 				<p className="text-sm text-white/75">To create a new password, you have to meet all of the following requirements: </p>
// 				<br />
// 				<p className="text-sm"> - Minimum 8 characters</p>
// 				<p className="text-sm"> - At least one lowercase</p>
// 				<p className="text-sm"> - At least one uppercase</p>
// 				<p className="text-sm"> - At least one number</p>
// 				<p className="text-sm"> - At least one special character</p>
// 				<p className="text-sm"> - Can&#39;t be the same as previous</p>
// 			</div>
// 		</div>
// 	);
// }

import React, { ChangeEvent, useEffect, useState } from "react";
import InputField from "@/app/(auth)/components/shared/form/InputField";
import { FormProvider } from "@/app/(auth)/components/shared/form/FormContext";
import useForm from "@/app/hooks/useForm";
import { toastError, toastLoading, toastSuccess } from "@/app/components/CustomToast";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { changePasswordSchema } from "@/app/(api)/schema";
import { simulateBackendCall } from "@/app/(api)/utils";
import FormButton from "@/app/(auth)/components/shared/ui/FormButton";

interface ChangePasswordFormProps {
	formId: string;
	setButtonDisabled: (disabled: boolean) => void;
	setButtonHidden: (hidden: boolean) => void;
}

export default function ChangePasswordForm({ formId, setButtonDisabled, setButtonHidden } : ChangePasswordFormProps) {
	const { apiClient } = useAuth();
	const [formData, touched, errors, debounced, handleChange, validateAll, resetForm] = useForm(
		changePasswordSchema,
		{ current_password: '', new_password: '', confirm_new_password: '' }
	);

	useEffect(() => {
		const hasErrors = Object.keys(errors).length > 0;
		const allTouched = Object.keys(touched).length === Object.keys(formData).length && Object.values(touched).every(t => t === true);
		const allDebounced = Object.keys(debounced).length === Object.keys(formData).length && Object.values(debounced).every(d => d === true);
		const allFilled = Object.values(formData).every(v => v.trim() !== '');

		const shouldBeHidden = hasErrors || (!allTouched) || (!allFilled) || (!allDebounced);
		console.log('ChangePasswordForm - shouldBeHidden: ', shouldBeHidden, { hasErrors, allTouched, allFilled, allDebounced });
		
		setButtonHidden(shouldBeHidden);
	}, [formData, errors, debounced, touched, setButtonHidden]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const isValid = validateAll();
		if (!isValid)
			return ;

		try {
			setButtonDisabled(true);
			await apiClient.changePassword({ oldPassword: formData.current_password, newPassword: formData.new_password});
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
		<div className="flex flex-col lg:flex-row gap-8 px-8 lg:px-14">
			{/* Form Section */}
			<div className="order-2 lg:order-1 lg:flex-1">
				<FormProvider
					formData={formData}
					touched={touched}
					errors={errors}
					debounced={debounced}
					handleChange={handleChange}
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
							label='Current Password'
							field='current_password'
							inputPlaceholder='••••••••••••••••'
							inputHidden={true}
						/>
						<InputField 
							className='field flex flex-col gap-0.5 box-border'
							iconSrc='/icons/lock.svg'
							label='New Password'
							field='new_password'
							inputPlaceholder='••••••••••••••••'
							inputHidden={true}
						/>
						<InputField 
							className='field flex flex-col gap-0.5 box-border'
							iconSrc='/icons/lock.svg'
							label='Confirm New Password'
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
					<div className="flex items-start gap-3 mb-4">
						<svg className="w-6 h-6 text-white/90 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<div>
							<h2 className="font-bold text-lg sm:text-xl text-white">Password Requirements</h2>
							<p className="text-sm text-white/70 mt-1">Your new password must meet all of the following criteria:</p>
						</div>
					</div>
					
					<ul className="space-y-2.5 mt-5">
						<li className="flex items-start gap-3 text-sm text-white/85">
							<svg className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>Minimum 8 characters long</span>
						</li>
						<li className="flex items-start gap-3 text-sm text-white/85">
							<svg className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>At least one lowercase letter</span>
						</li>
						<li className="flex items-start gap-3 text-sm text-white/85">
							<svg className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>At least one uppercase letter</span>
						</li>
						<li className="flex items-start gap-3 text-sm text-white/85">
							<svg className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>At least one number</span>
						</li>
						<li className="flex items-start gap-3 text-sm text-white/85">
							<svg className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>At least one special character (!@#$%^&*)</span>
						</li>
						<li className="flex items-start gap-3 text-sm text-white/85">
							<svg className="w-5 h-5 text-white/60 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>Cannot be the same as your previous password</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}