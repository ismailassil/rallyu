import React, { useState, useRef } from 'react';
import SettingsCard from '../../SettingsCard';
import { useAuth } from '../../../../contexts/AuthContext';
import ProfilePreview from './ProfilePreview';
import PersonalInformationsForm from './PersonalInformationsForm';
import useForm from '@/app/hooks/useForm';
import { CircleOff, LoaderCircle, Save } from 'lucide-react';
import { FormProvider } from '@/app/(auth)/components/Form/FormContext';
import { motion } from 'framer-motion';
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

	const [avatarHasChanges, setAvatarHasChanges] = useState(false);
	const [formHasChanges, setFormHasChanges] = useState(false);
	const avatarUploadRef = useRef<any | null>(null);
	const personalInfoFormRef = useRef<any | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		personalInfoSettingsSchema
	} = useValidationSchema();

	const { loggedInUser } = useAuth();

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

	async function handleSubmit() {
		setIsSubmitting(true);
		await avatarUploadRef.current.submit();
		await personalInfoFormRef.current.submit();
		setTimeout(() => {
			setIsSubmitting(false);
		}, 500);
	}

	const hasUnsavedChanges = avatarHasChanges || formHasChanges;

	return (
		<motion.div
			initial={{ opacity: 0, x: 15 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -15 }}
			transition={{ duration: 0.5 }}
			className='h-full'
		>
			<SettingsCard
				title={t('title')}
				subtitle={t('subtitle')}
				actionButtonOptions={{
					title: t('button'),
					icon: isSubmitting ? <LoaderCircle size={16} className='animate-spin' /> : hasUnsavedChanges ? <Save size={16} /> : <CircleOff size={16} />,
					iconKey: isSubmitting ? 'loader' : hasUnsavedChanges ? 'save' : 'circle-off',
					onClick: handleSubmit,
					disabled: !hasUnsavedChanges || isSubmitting
				}}
				initialHeight='full'
				className='hide-scrollbar h-full overflow-auto'
			>
				<div className='flex flex-col gap-8'>
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
