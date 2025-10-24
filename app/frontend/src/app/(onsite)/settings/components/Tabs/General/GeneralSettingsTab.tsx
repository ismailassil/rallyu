import React, { useState, ChangeEvent } from 'react';
import SettingsCard from '../../SettingsCard';
import { useAuth } from '../../../../contexts/AuthContext';
import ProfilePreview from './ProfilePreview';
import PersonalInformationsForm from './PersonalInformationsForm';
import useForm from '@/app/hooks/useForm';
import { toastError, toastSuccess } from '@/app/components/CustomToast';
import { LoaderCircle } from 'lucide-react';
import { FormProvider } from '@/app/(auth)/components/Form/FormContext';
import { motion } from 'framer-motion';
// import useAPICall from '@/app/hooks/useAPICall';
import useAvailabilityCheck from '@/app/hooks/useAvailabilityCheck';
import useCanSave from '@/app/hooks/useCanSave';
import { useTranslations } from 'next-intl';
import useValidationSchema from '@/app/hooks/useValidationSchema';

export interface FormDataState {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	bio: string;
	avatar_url: string;
}

/*
	In this tab the user can only update: First Name, Last Name, Username, Email, Bio, Avatar
	Password change is in Security tab
*/

export default function GeneralSettingsTab() {
	const t = useTranslations('settings.general.cards.personal_infos');
	const tautherr = useTranslations('auth');

	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const {
		personalInfoSettingsSchema
	} = useValidationSchema();

	const {
		apiClient,
		loggedInUser,
		triggerLoggedInUserRefresh
	} = useAuth();

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

	const { status: usernameStatus, setStatus: setUsernameStatus } = useAvailabilityCheck('username', formData.username, loggedInUser!.username, debounced.username, errors.username);
	const { status: emailStatus, setStatus: setEmailStatus } = useAvailabilityCheck('email', formData.email, loggedInUser!.email, debounced.email, errors.email);
	const canSave = useCanSave(formData, debounced, errors, avatarFile, usernameStatus, emailStatus, loggedInUser!, getValidationErrors);

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

		await apiClient.updateUserAvatar(loggedInUser!.id, form);
		setAvatarFile(null);
	}

	async function updateUserInfo() {
		validateAll();
		const payload = getUpdatedFormPayload();
		const errors = getValidationErrors();

		if (Object.keys(payload).length === 0 || errors)
			return ;

		await apiClient.updateUser(loggedInUser!.id, payload);
		// updateLoggedInUserState(payload); // AuthContext
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
			triggerLoggedInUserRefresh();
			toastSuccess('Changes saved successfully');
			// updateLoggedInUserState(getUpdatedFormPayload());
			resetForm(formData);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.group('handleSubmit in personalInfoForm');
			console.log(err);
			console.groupEnd();
			if (err.message === 'AUTH_USERNAME_TAKEN') setUsernameStatus('unavailable');
			else if (err.message === 'AUTH_EMAIL_TAKEN') setEmailStatus('unavailable');
			else toastError(tautherr('errorCodes', { code: err.message }));
		} finally {
			setIsSubmitting(false);
		}
	}


	return (
		<motion.div
			initial={{ opacity: 0, x: 15 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 1, x: -15 }}
			transition={{ duration: 0.5 }}
			className='h-full'
		>
		<SettingsCard
			title={t('title')}
			subtitle={t('subtitle')}
			actionIcon={isSubmitting ? <LoaderCircle size={16} className='animate-spin' /> : undefined}
			onAction={handleSubmit}
			isButtonHidden={!canSave}
			isButtonDisabled={isSubmitting}
			className='h-full overflow-auto hide-scrollbar'
		>
			<div className="flex flex-col gap-8">
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
		</motion.div>
	);
}
