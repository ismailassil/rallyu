import React, { ChangeEvent, useEffect, useState } from "react";
import FormField from "@/app/(auth)/components/Forms/FormField";
import useForm from "@/app/hooks/useForm";
import { toastError, toastLoading, toastSuccess } from "@/app/components/CustomToast";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { changePasswordSchema } from "@/app/(api)/schema";
import { simulateBackendCall } from "@/app/(api)/utils";

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
		<div className="flex gap-12 px-14 py-6 max-lg:flex-col max-lg:gap-8 max-lg:px-10">
			<form 
				id={formId}
				onSubmit={handleSubmit}
				className="flex flex-col flex-2 gap-4"
			>
				<FormField 
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/lock.svg'
					label='Current Password'
					field='current_password'
					inputPlaceholder='••••••••••••••••'
					inputValue={formData.current_password}
					hidden={true}
					onChange={handleChange}
					touched={touched.current_password}
					error={errors.current_password}
					debounced={debounced.current_password}
				/>
				<FormField 
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/lock.svg'
					label='New Password'
					field='new_password'
					inputPlaceholder='••••••••••••••••'
					inputValue={formData.new_password}
					hidden={true}
					onChange={handleChange}
					touched={touched.new_password}
					error={errors.new_password}
					debounced={debounced.new_password}
				/>
				<FormField 
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/lock.svg'
					label='Confirm New Password'
					field='confirm_new_password'
					inputPlaceholder='••••••••••••••••'
					inputValue={formData.confirm_new_password}
					hidden={true}
					onChange={handleChange}
					touched={touched.confirm_new_password}
					error={errors.confirm_new_password}
					debounced={debounced.confirm_new_password}
				/>
			</form>
			<div className='bg-gradient-to-br from-white/0 to-white/4 border-1 border-white/6 rounded-2xl px-8 py-6 flex-1'>
				<h1 className="font-bold text-xl">Rules for passwords</h1>
				<p className="text-sm text-white/75">To create a new password, you have to meet all of the following requirements: </p>
				<br />
				<p className="text-sm"> - Minimum 8 characters</p>
				<p className="text-sm"> - At least one lowercase</p>
				<p className="text-sm"> - At least one uppercase</p>
				<p className="text-sm"> - At least one number</p>
				<p className="text-sm"> - At least one special character</p>
				<p className="text-sm"> - Can&#39;t be the same as previous</p>
			</div>
		</div>
	);
}
