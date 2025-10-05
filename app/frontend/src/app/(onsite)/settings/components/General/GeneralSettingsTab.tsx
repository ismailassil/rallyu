import React, { useState, ChangeEvent, useCallback, useEffect } from 'react';
import SettingsCard from '../SettingsCard';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import ProfilePreview from './ProfilePreview';
import PersonalInformationsForm from './PersonalInformationsForm';
import useForm from '@/app/hooks/useForm';
import { toastError, toastSuccess } from '@/app/components/CustomToast';
import { LoaderCircle } from 'lucide-react';
import { personalInfoSettingsSchema } from '@/app/(api)/schema';
import { FormProvider } from '@/app/(auth)/components/shared/form/FormContext';
import useAPICall from '@/app/hooks/useAPICall';
import useAvailabilityCheck from '@/app/hooks/useAvailabilityCheck';
import useCanSave from '@/app/hooks/useCanSave';

export interface FormDataState {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	bio: string;
	avatar_url: string;
}

// export interface FormData {
// 	fname: string;
// 	lname: string;
// 	username: string;
// 	email: string;
// 	bio: string;
// }

/*
	In this tab the user can only update: First Name, Last Name, Username, Email, Bio, Avatar
	Password change is in Security tab
*/

export default function GeneralSettingsTab() {
	const { apiClient, loggedInUser, updateLoggedInUserState } = useAuth();
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const {
		executeAPICall
	} = useAPICall();

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
		personalInfoSettingsSchema,
		{ first_name: loggedInUser!.first_name, last_name: loggedInUser!.last_name, username: loggedInUser!.username, email: loggedInUser!.email, bio: loggedInUser!.bio },
		{ debounceMs: { email: 1200, username: 1200 } }
	);

	const usernameStatus = useAvailabilityCheck('username', formData.username, loggedInUser!.username, debounced.username, errors.username);
	const emailStatus = useAvailabilityCheck('email', formData.email, loggedInUser!.email, debounced.email, errors.email);
	const canSave = useCanSave(formData, debounced, errors, avatarFile, usernameStatus, emailStatus, loggedInUser!, getValidationErrors);


	// function fnShowSaveChanges() : boolean {
	// 	// if we changed something
	// 	if (Object.keys(getUpdatedFormPayload()).length === 0 && avatarFile === null)
	// 		return false;

	// 	// check if all changed fields are debounced
	// 	for (const key in getUpdatedFormPayload()) {
	// 		if (!debounced[key as keyof typeof debounced]) {
	// 			return false;
	// 		}
	// 	}

	// 	if (getValidationErrors())
	// 		return false;

	// 	if (usernameStatus !== 'available' && usernameStatus !== 'idle')
	// 		return false;
	// 	if (emailStatus !== 'available' && emailStatus !== 'idle')
	// 		return false;

	// 	return true;
	// }

	function handleAvatarFileChange(e: ChangeEvent<HTMLInputElement>) {
		const selectedFile = e.target.files?.[0];
		if (!selectedFile)
			return ;
		setAvatarPreview(URL.createObjectURL(selectedFile));
		setAvatarFile(selectedFile);
	}

	function handleAvatarFileRemove() {
		const fileInput = document.getElementById('profile-upload') as HTMLInputElement;
		if (fileInput)
			fileInput.value = '';
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
		validateAll();
		const payload = getUpdatedFormPayload();
		const errors = getValidationErrors();

		if (Object.keys(payload).length === 0 || errors)
			return ;

		await apiClient.updateUser(loggedInUser!.id, payload);
		updateLoggedInUserState(payload); // AuthContext
	}

	function getUpdatedFormPayload() {
		const payload: Partial<FormDataState> = {};

		for (const key in formData) {
			const oldValue = loggedInUser![key as keyof typeof loggedInUser];
			const newValue = formData[key as keyof FormDataState];

			if (newValue !== '' && newValue !== oldValue) {
				payload[key as keyof FormDataState] = newValue;
			}
		}

		return payload;
	}

	async function handleSubmit() {
		const isValid = validateAll();
		if (!isValid)
			return ;

		try {
			setIsSubmitting(true);
			await updateUserInfo();
			await uploadAvatar();
			toastSuccess('Changes saved successfully');
			updateLoggedInUserState(getUpdatedFormPayload());
			resetForm(formData);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toastError(err.message || 'Something went wrong, please try again later');
		} finally {
			setIsSubmitting(false);
		}
	}


	return (
		<motion.div
			initial={{ opacity: 0, x: 5 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 1, x: -5 }}
			transition={{ duration: 0.5 }}
		>
			<div className="flex flex-col gap-4">
				<SettingsCard
					title="Personal Informations"
					subtitle="Update your account profile information and email address"
					actionIcon={isSubmitting ? <LoaderCircle size={16} className='animate-spin' /> : undefined}
					onAction={handleSubmit}
					isButtonHidden={!canSave}
					isButtonDisabled={isSubmitting}
				>
					<div className="flex flex-col gap-8 px-18">
						<FormProvider
							formData={formData}
							touched={touched}
							errors={errors}
							debounced={debounced}
							handleChange={handleChange}
							validateAll={validateAll}
							getValidationErrors={getValidationErrors}
							resetForm={resetForm}
						>
							<ProfilePreview 
								avatarFile={avatarFile}
								avatarBlobPreview={avatarPreview}
								onAddAvatarFile={handleAvatarFileChange}
								onRemoveAvatarFile={handleAvatarFileRemove}
							/>
							<PersonalInformationsForm
								usernameStatus={usernameStatus}
								emailStatus={emailStatus}
							/>
						</FormProvider>
					</div>
				</SettingsCard>
			</div>
		</motion.div>
	);
}
