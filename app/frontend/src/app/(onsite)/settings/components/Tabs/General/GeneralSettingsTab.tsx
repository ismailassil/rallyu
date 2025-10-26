import React, { useState, ChangeEvent, useEffect, useRef, useMemo } from 'react';
import SettingsCard from '../../SettingsCard';
import { useAuth } from '../../../../contexts/AuthContext';
import ProfilePreview from './ProfilePreview';
import PersonalInformationsForm from './PersonalInformationsForm';
import useForm from '@/app/hooks/useForm';
import { toastError, toastSuccess } from '@/app/components/CustomToast';
import { CheckCheck, LoaderCircle, X } from 'lucide-react';
import { FormProvider } from '@/app/(auth)/components/Form/FormContext';
import { motion } from 'framer-motion';
import useAvailabilityCheck from '@/app/hooks/useAvailabilityCheck';
import useCanSave from '@/app/hooks/useCanSave';
import { useTranslations } from 'next-intl';
import useValidationSchema from '@/app/hooks/useValidationSchema';
import useAPICall from '@/app/hooks/useAPICall';

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
	const t = useTranslations("settings.general.cards.personal_infos");
	const tautherr = useTranslations("auth");

	const avatarUploadRef = useRef<any | null>(null);
	const personalInfoFormRef = useRef<any | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	// const [avatarFile, setAvatarFile] = useState<File | null>(null);
	// const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


	const {
		personalInfoSettingsSchema
	} = useValidationSchema();

	// const {
	// 	executeAPICall
	// } = useAPICall();

	const { apiClient, loggedInUser, triggerLoggedInUserRefresh } = useAuth();

	const [
		formData,
		touched,
		errors,
		debounced,
		handleChange,
		validateAll,
		getValidationErrors,
		resetForm,
	] = useForm(
		personalInfoSettingsSchema,
		{
			first_name: loggedInUser!.first_name,
			last_name: loggedInUser!.last_name,
			username: loggedInUser!.username,
			email: loggedInUser!.email,
			bio: loggedInUser!.bio,
		},
		{ debounceMs: { email: 1200, username: 1200, password: 1200 } }
	);

	// useEffect(() => {
	// 	if (!loggedInUser)
	// 		return ;

	// 	console.group('useEffect on loggedInUser change');
	// 	console.log(loggedInUser);
	// 	console.groupEnd();

	// 	resetForm({
	// 		first_name: loggedInUser.first_name,
	// 		last_name: loggedInUser.last_name,
	// 		username: loggedInUser.username,
	// 		email: loggedInUser.email,
	// 		bio: loggedInUser.bio
	// 	});
	// }, [loggedInUser]);

	// const { status: usernameStatus, setStatus: setUsernameStatus } = useAvailabilityCheck('username', formData.username, loggedInUser!.username, debounced.username, errors.username);
	// const { status: emailStatus, setStatus: setEmailStatus } = useAvailabilityCheck('email', formData.email, loggedInUser!.email, debounced.email, errors.email);
	// const canSave = useCanSave(formData, debounced, errors, avatarFile, usernameStatus, emailStatus, loggedInUser!, getValidationErrors);

	// function handleAvatarFileChange(e: ChangeEvent<HTMLInputElement>) {
	// 	const selectedFile = e.target.files?.[0];
	// 	if (!selectedFile) return;
	// 	setAvatarPreview(URL.createObjectURL(selectedFile));
	// 	setAvatarFile(selectedFile);
	// }

	// function handleAvatarFileRemove() {
	// 	const fileInput = document.getElementById("profile-upload") as HTMLInputElement;
	// 	if (fileInput) fileInput.value = "";
	// 	setAvatarFile(null);
	// 	setAvatarPreview(null);
	// }

	// async function uploadAvatar() {
	// 	if (!avatarFile) return;

	// 	const form = new FormData();
	// 	form.append("file", avatarFile);

	// 	await executeAPICall(() => apiClient.updateUserAvatar(loggedInUser!.id, form));
	// 	setAvatarFile(null);
	// }

	// async function updateUserInfo() {
	// 	validateAll();
	// 	const payload = getUpdatedFormPayload();
	// 	const errors = getValidationErrors();

	// 	if (Object.keys(payload).length === 0 || errors) return;

	// 	await executeAPICall(() => apiClient.updateUser(loggedInUser!.id, payload));
	// }

	// function getUpdatedFormPayload() {
	// 	const payload: Partial<FormDataState> = {};

	// 	for (const key in formData) {
	// 		const oldValue = loggedInUser![key as keyof typeof loggedInUser];
	// 		const newValue = formData[key as keyof FormDataState];

	// 		if (newValue !== "" && newValue !== oldValue) {
	// 			payload[key as keyof FormDataState] = newValue;
	// 		}
	// 	}

	// 	return payload;
	// }

	// async function handleSubmit() {
	// 	const isValid = validateAll();
	// 	if (!isValid) return;

	// 	try {
	// 		setIsSubmitting(true);
	// 		await updateUserInfo();
	// 		await uploadAvatar();
	// 		triggerLoggedInUserRefresh();
	// 		toastSuccess('Changes saved successfully');
	// 		resetForm(formData);
	// 	} catch (err: any) {
	// 		if (err.message === 'AUTH_USERNAME_TAKEN') setUsernameStatus('unavailable');
	// 		else if (err.message === 'AUTH_EMAIL_TAKEN') setEmailStatus('unavailable');
	// 		else toastError(tautherr('errorCodes', { code: err.message }));
	// 	} finally {
	// 		setIsSubmitting(false);
	// 	}
	// }

	const [avatarHasChanges, setAvatarHasChanges] = useState(false);
	const [formHasChanges, setFormHasChanges] = useState(false);

	async function handleSubmit() {
		setIsSubmitting(true);
		await avatarUploadRef.current.submit();
		await personalInfoFormRef.current.submit();
		setIsSubmitting(false);
	}

	const hasUnsavedChanges = avatarHasChanges || formHasChanges;

	return (
		<motion.div
			initial={{ opacity: 0, x: 15 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -15 }}
			transition={{ duration: 0.5 }}
			className="h-full"
		>
			<SettingsCard
				title={t("title")}
				subtitle={t("subtitle")}
				actionButtonOptions={{
					title: 'Save Changes',
					icon: isSubmitting ? <LoaderCircle size={16} className="animate-spin" /> : hasUnsavedChanges ? <CheckCheck size={16} /> : <X size={16} />,
					iconKey: isSubmitting ? 'loader' : hasUnsavedChanges ? 'check-check' : 'x',
					onClick: handleSubmit,
					disabled: !hasUnsavedChanges || isSubmitting
				}}
				className="hide-scrollbar h-full overflow-auto"
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
							ref={avatarUploadRef}
							onChange={(hasUnsavedChanges) => setAvatarHasChanges(hasUnsavedChanges)}
						/>
						<PersonalInformationsForm
							ref={personalInfoFormRef}
							onChange={(hasUnsavedChanges) => setFormHasChanges(hasUnsavedChanges)}
						/>
					</FormProvider>
				</div>
			</SettingsCard>
		</motion.div>
	);
}
