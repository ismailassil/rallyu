import React, { useState, ChangeEvent, useCallback } from 'react';
import SettingsCard from '../SettingsCard';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import ProfilePreview from './ProfilePreview';
import PersonalInformationsForm from './PersonalInformationsForm';
import useForm from '@/app/hooks/useForm';
import { alertError, alertSuccess } from '@/app/(auth)/components/CustomToast';
import { LoaderCircle } from 'lucide-react';
import { personalInfoSettingsSchema } from '@/app/(api)/schema';

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
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const [formData, touched, errors, debounced, handleChange, validateAll, resetForm] = useForm(
		personalInfoSettingsSchema,
		{ first_name: loggedInUser!.first_name, last_name: loggedInUser!.last_name, username: loggedInUser!.username, email: loggedInUser!.email, bio: loggedInUser!.bio },
		{ debounceMs: { username: 1200, email: 1200 } } // debounce username and email validation by 1000ms
	);
	const [fieldsAvailable, setFieldsAvailable] = useState({
		username: true,
		email: true
	});

	const updateFieldAvailable = useCallback((name: string, available: boolean) => {
		setFieldsAvailable(prev => ({ ...prev, [name]: available }));
	}, []);

	const showSaveChanges = ((Object.keys(getUpdatedFormPayload()).length > 0 || avatarFile !== null) && Object.keys(errors).length === 0 && fieldsAvailable.username && fieldsAvailable.email);

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
		if (!avatarFile)
			return ;

		const form = new FormData();
		form.append('file', avatarFile);

		await apiClient.uploadUserAvatar(form);
		setAvatarFile(null);
	}

	async function updateUserInfo() {
		const payload = getUpdatedFormPayload();

		if (Object.keys(payload).length === 0 || !validateAll())
			return ;

		await apiClient.updateUser(loggedInUser!.username, payload);
		updateLoggedInUserState(payload); // AuthContext
	}

	function getUpdatedFormPayload() {
		const payload: Partial<FormData> = {};

		for (const key in formData) {
			const oldValue = loggedInUser![key as keyof typeof loggedInUser];
			const newValue = formData[key as keyof FormData];

			if (newValue !== '' && newValue !== oldValue) {
				payload[key as keyof FormData] = newValue;
			}
		}

		return payload;
	}

	async function handleSubmit() {
		const isValid = validateAll();
		if (!isValid)
			return ;

		if (!fieldsAvailable.username || !fieldsAvailable.email)
			return ;

		try {
			setIsSubmitting(true);
			await updateUserInfo();
			await uploadAvatar();
			alertSuccess('Changes saved successfully');
			updateLoggedInUserState(getUpdatedFormPayload());
			resetForm(formData);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			alertError(err.message || 'Something went wrong, please try again later');
		} finally {
			setIsSubmitting(false);
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
					actionIcon={isSubmitting ? <LoaderCircle size={16} className='animate-spin' /> : undefined}
					formSubmitLabel='Save Changes'
					onSubmit={handleSubmit}
					isButtonHidden={!showSaveChanges}
					isButtonDisabled={isSubmitting}
				>
					<div className="flex flex-col gap-8 px-18">
						<ProfilePreview 
							values={formData}
							avatarFile={avatarFile}
							avatarBlobPreview={avatarPreview}
							onAddAvatarFile={handleAvatarFileChange}
							onRemoveAvatarFile={handleAvatarFileRemove}
						/>
						<PersonalInformationsForm
							formData={formData}
							touched={touched}
							errors={errors}
							debounced={debounced}
							onChange={handleChange}
							setFieldAvailable={updateFieldAvailable}
						/>
					</div>
				</SettingsCard>
			</div>
		</motion.div>
	);
}
