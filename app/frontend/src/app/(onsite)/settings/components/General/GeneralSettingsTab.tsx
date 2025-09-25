import React, { useState, ChangeEvent, useEffect } from 'react';
import SettingsCard from '../SettingsCards';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import ProfilePreview from './ProfilePreview';
import PersonalInformationsForm from './PersonalInformationsForm';
import useForm from '../hooks/useForm';
import { alertError, alertLoading, alertSuccess } from '@/app/(auth)/components/CustomToast';

export interface FormDataState {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	bio: string;
	avatar_url: string;
}

export interface FormData {
	fname: string;
	lname: string;
	username: string;
	email: string;
	bio: string;
}

/*
	In this tab the user can only update: First Name, Last Name, Username, Email, Bio, Avatar
	Password change is in Security tab
*/

export default function GeneralSettingsTab() {
	const { apiClient, loggedInUser, updateLoggedInUserState } = useAuth();
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);

	const [formData, touched, errors, debounced, handleChange, validateAll] = useForm({
		fname: loggedInUser!.first_name,
		lname: loggedInUser!.last_name,
		username: loggedInUser!.username,
		email: loggedInUser!.email,
		bio: loggedInUser!.bio
	});

	function handleAvatarFileChange(e: ChangeEvent<HTMLInputElement>) {
		const selectedFile = e.target.files?.[0];
		if (!selectedFile) return;
		setAvatarPreview(URL.createObjectURL(selectedFile));
		setAvatarFile(selectedFile);
	}

	function handleAvatarFileRemove() {
		const fileInput = document.getElementById('profile-upload') as HTMLInputElement;
		if (fileInput) fileInput.value = '';
		setAvatarFile(null);
		setAvatarPreview(null);
	}

	async function uploadAvatar() {
		if (!avatarFile) return;

		const form = new FormData();
		form.append('file', avatarFile);

		try {
			// alertLoading('Uploading Profile Picture...');
			await apiClient.uploadUserAvatar(form);
			// if (avatarPreview)
			// 	updateLoggedInUserState({ avatar_url: avatarPreview });
			// alertSuccess('Profile Picture changed successfully');
			setAvatarFile(null);
		} catch {
			// alertError('Something went wrong, please try again later');
		}
	}

	async function updateUserInfo() {
		const payload = getUpdatedFormPayload();

		if (Object.keys(payload).length === 0) {
			alertError('No changes to submit');
			return;
		}

		if (!validateAll())
			return ;

		await apiClient.updateUser(loggedInUser!.username, payload);
		updateLoggedInUserState(payload); // AuthContext
	}

	function getUpdatedFormPayload() {
		const payload: Partial<FormData> = {};

		const keyMap: Record<string, string> = {
			fname: 'first_name',
			lname: 'last_name',
		};
		
		for (const key in formData) {
			const mappedKey = keyMap[key] || key;
			const userValue = loggedInUser![mappedKey as keyof typeof loggedInUser];
			const formValue = formData[key as keyof FormData];

			if (formValue !== '' && formValue !== userValue) {
				payload[mappedKey as keyof typeof payload] = formValue;
			}
		}

		return payload;
	}

	async function handleSubmit() {
		try {
			alertLoading('Submitting changes...');
			await updateUserInfo();
			await uploadAvatar();
			alertSuccess('Changes saved successfully');
		} catch {
			alertError('Something went wrong, please try again');
		}
	}


	return (
		<motion.div
			initial={{ opacity: 0, x: 25, scale: 0.99 }}
			animate={{ opacity: 1, x: 0, scale: 1 }}
			transition={{ duration: 0.5 }}
		>
			<div className="flex flex-col gap-4">
				<SettingsCard
					title="Personal Informations"
					subtitle="Update your account profile information and email address"
					isForm={true}
					formSubmitLabel='Save Changes'
					onSubmit={handleSubmit}
				>
					<div className="flex flex-col gap-8 px-18">
						<ProfilePreview
							values={formData}
							file={avatarFile}
							avatarBlobPreview={avatarPreview}
							onAdd={handleAvatarFileChange}
							onRemove={handleAvatarFileRemove}
						/>
						<PersonalInformationsForm
							formData={formData}
							touched={touched}
							errors={errors}
							debounced={debounced}
							onChange={handleChange}
						/>
					</div>
				</SettingsCard>
			</div>
		</motion.div>
	);
}
