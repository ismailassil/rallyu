import React, { useState, ChangeEvent } from 'react';
import SettingsCard from '../SettingsCards';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import ProfilePreview from './ProfilePreview';
import PersonalInformationsForm from './PersonalInformationsForm';
import useUserProfile from '@/app/(onsite)/(user-profile)/users/context/useUserProfile';
import useForm from '../hooks/useForm';
import { alertError, alertLoading, alertSuccess } from '@/app/(auth)/components/Alert';
import { toast } from 'sonner';

export interface FormDataState {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	bio: string;
	avatar_path: string;
}

export interface FormData {
	fname: string;
	lname: string;
	username: string;
	email: string;
	bio: string;
}

export default function General() {
	const { api, user, updateUser } = useAuth();
	// const { isLoading, userProfile } = useUserProfile(user!.username);

	const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
	const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
	const [formData, touched, errors, debounced, handleChange, validateAll] = useForm({
		fname: user!.first_name,
		lname: user!.last_name,
		username: user!.username,
		email: user!.email,
		bio: user!.bio
	});

	// if (isLoading || !userProfile)
	// 	return <h1 className='top-50 left-7 bg-red-500'>still loading</h1>;

	function handleProfilePictureFileChange(e: ChangeEvent<HTMLInputElement>) {
		const selectedFile = e.target.files?.[0];
		if (!selectedFile) return;
		setProfilePicturePreview(URL.createObjectURL(selectedFile));
		setProfilePictureFile(selectedFile);
	}

	function handleProfilePictureRemove() {
		const fileInput = document.getElementById('profile-upload') as HTMLInputElement;
		if (fileInput) fileInput.value = '';
		setProfilePictureFile(null);
		setProfilePicturePreview(null);
	}

	// function handleFormChange(e: ChangeEvent<HTMLInputElement>) {
	// 	const { name, value } = e.target;
	// 	setFormData(prev => ({ ...prev, [name]: value }));
	// }

	async function handleProfilePictureSubmit() {
		if (!profilePictureFile) return;

		const form = new FormData();
		form.append('file', profilePictureFile);

		try {
			// alertLoading('Uploading Profile Picture...');
			await api.uploadUserAvatar(form);
			if (profilePicturePreview)
				updateUser({ avatar_url: profilePicturePreview });
			// alertSuccess('Profile Picture changed successfully');
			setProfilePictureFile(null);
		} catch {
			// alertError('Something went wrong, please try again later');
		}
	}

	async function handleFormSubmit() {
		const payload: Partial<FormData> = {};

		const keyMap: Record<string, string> = {
			fname: 'first_name',
			lname: 'last_name',
		};
		
		for (const key in formData) {
			const mappedKey = keyMap[key] || key;
			const userValue = user![mappedKey as keyof typeof user];
			const formValue = formData[key as keyof FormData];

			if (formValue !== '' && formValue !== userValue) {
				payload[mappedKey as keyof typeof payload] = formValue;
			}
		}

		console.log('Paylod to submit: ', payload);
		console.log('Object.keys(payloadToSubmit).length: ', Object.keys(payload).length);

		if (Object.keys(payload).length === 0) {
			alertError('DEV - No changes to submit');
			alert('DEV - No changes to submit');
			return;
		}

		const isValid = validateAll();
		if (!isValid)
			return ;

		try {
			// alertLoading('Submitting form...');
			const res = await api.updateUser(user!.username, payload);
			console.log('Update user response: ', res);
			// alertSuccess('Form changes saved successfully');
			updateUser(payload); // AuthContext

		} catch {
			// alertError('Someting went wrong, please try again');
		}
	}

	async function handleSubmit() {
		try {
			alertLoading('Submitting changes...');
			await handleFormSubmit();
			await handleProfilePictureSubmit();
			alertSuccess('Changes saved successfully');
		} catch {
			alertError('Something went wrong, please try again');
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, x: 25 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="flex flex-col gap-4">
				<SettingsCard
					title="Personal Informations"
					subtitle="Update your account profile information and email address"
					onSubmit={handleSubmit}
					isForm={true}
				>
					<div className="flex flex-col gap-8 px-18">
						<ProfilePreview
							values={formData}
							file={profilePictureFile}
							preview={profilePicturePreview}
							onAdd={handleProfilePictureFileChange}
							onRemove={handleProfilePictureRemove}
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
