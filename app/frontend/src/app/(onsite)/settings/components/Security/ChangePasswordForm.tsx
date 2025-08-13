import React, { useState } from "react";
import FormField from "@/app/(auth)/signup/components/FormField";
import useForm from "../hooks/useForm";
import { alertError, alertLoading, alertSuccess } from "@/app/(auth)/components/Alert";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";

export default function ChangePasswordForm() {
	// const [currentPassword, setCurrentPassword] = useState('');
	// const [newPassword, setNewPassword] = useState('');
	// const [confirmNewPassword, setConfirmNewPassword] = useState('');

	const { api } = useAuth();
	const [formData, touched, errors, debounced, handleChange, validateAll] = useForm({
		'current-password': '',
		'new-password': '',
		'new-confirm-password': ''
	});

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const isValid = validateAll();
		if (!isValid)
			return ;

		try {
			alertLoading('Changing password...');
			const res = await api.changePassword({ old_password: formData['current-password'], new_password: formData['new-password']});
			console.log('Update password response: ', res);
			alertSuccess('Password changed successfully');
		} catch (err) {
			alertError('Someting went wrong, please try again');
		}
	}

	return (
		<div className='flex px-18 gap-8'>
			<div className='flex flex-col gap-4 flex-2'>
				<form id="settings-change-password-form" action="" onSubmit={handleSubmit}>
					<FormField 
						label='Current Password'
						field='current-password'
						inputPlaceholder='••••••••••••••••'
						iconSrc='/icons/lock.svg'
						inputValue={formData['current-password']}
						debounced={debounced['current-password']}
						touch={touched['current-password']}
						error={errors["current-password"]}
						onChange={handleChange}
						hidden={true}
					/>
					<FormField
						label="New Password"
						field="new-password"
						inputPlaceholder="••••••••••••••••"
						iconSrc="/icons/lock.svg"
						inputValue={formData["new-password"]}
						debounced={debounced["new-password"]}
						touch={touched["new-password"]}
						error={errors["new-password"]}
						onChange={handleChange}
						hidden={true}
					/>
					<FormField
						label="Confirm New Password"
						field="new-confirm-password"
						inputPlaceholder="••••••••••••••••"
						iconSrc="/icons/lock.svg"
						inputValue={formData["new-confirm-password"]}
						debounced={debounced["new-confirm-password"]}
						touch={touched["new-confirm-password"]}
						error={errors["new-confirm-password"]}
						onChange={handleChange}
						hidden={true}
					/>
					<button type="submit">DEV - SUBMIT</button>
				</form>
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
