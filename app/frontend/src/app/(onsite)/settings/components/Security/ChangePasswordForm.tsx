import React, { ChangeEvent, useState } from "react";
import FormField from "@/app/(auth)/components/Forms/FormField";
import useForm from "@/app/hooks/useForm";
import { toastError, toastLoading, toastSuccess } from "@/app/components/CustomToast";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { changePasswordSchema } from "@/app/(api)/schema";

interface ChangePasswordFormProps {
	formData: Record<string, string>;
	touched: Record<string, boolean>;
	errors: Record<string, string>;
	debounced: Record<string, boolean>;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ChangePasswordForm({ 
	formData,
	touched,
	errors,
	debounced,
	onChange
} : ChangePasswordFormProps) {
	// async function handleSubmit(e: React.FormEvent) {
	// 	e.preventDefault();

	// 	const isValid = validateAll();
	// 	if (!isValid)
	// 		return ;

	// 	try {
	// 		toastLoading('Changing password...');
	// 		const res = await apiClient.changePassword({ old_password: formData['current-password'], new_password: formData['new-password']});
	// 		console.log('Update password response: ', res);
	// 		toastSuccess('Password changed successfully');
	// 	} catch (err) {
	// 		toastError('Someting went wrong, please try again');
	// 	}
	// }

	return (
		<div className="flex gap-12 px-14 py-6 max-lg:flex-col max-lg:gap-8 max-lg:px-10">
			<div className="flex flex-col flex-2 gap-4">
				<FormField 
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/lock.svg'
					label='Current Password'
					field='current_password'
					inputPlaceholder='••••••••••••••••'
					inputValue={formData.current_password}
					hidden={true}
					onChange={onChange}
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
					onChange={onChange}
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
					onChange={onChange}
					touched={touched.confirm_new_password}
					error={errors.confirm_new_password}
					debounced={debounced.confirm_new_password}
				/>
			</div>
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
