import React, { useRef, useState } from 'react'
import SettingsCard from '../../../SettingsCard';
import ChangePasswordForm from './ChangePasswordForm';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { CircleOff, LoaderCircle, Lock, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ChangePasswordSettingCard() {
	const t = useTranslations('settings.security.cards.change_password_form');

	const changePasswordFormRef = useRef<HTMLFormElement | null>(null);
	const changePasswordCardRef = useRef<any | null>(null);

	const [isEditing, setIsEditing] = useState(false);
	const [canSave, setCanSave] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		loggedInUser
	} = useAuth();

	function expandCard() {
		setIsEditing(true);
		changePasswordCardRef.current?.expand();
	}

	function collapseCard() {
		setIsEditing(false);
		changePasswordCardRef.current?.collapse();
	}

	if (!loggedInUser || loggedInUser.auth_provider !== 'Local')
		return null;

	return (
		<SettingsCard
			ref={changePasswordCardRef}
			title={t('title')}
			subtitle={t('subtitle')}
			actionButtonOptions={{
				title: t('button'),
				icon: isSubmitting ? <LoaderCircle size={16} className="animate-spin" /> : isEditing ? (canSave ? <Save size={16} /> : <CircleOff size={16} />) : <Lock size={16} /> ,
				iconKey: isSubmitting ? 'loader' : isEditing ? (canSave ? 'check-check' : 'x') : 'lock' ,
				onClick: isEditing ? (canSave ? () => changePasswordFormRef.current?.requestSubmit() : collapseCard) : expandCard,
				disabled: isSubmitting
			}}
			defaultExpanded={false}
		>

			<ChangePasswordForm
				formRef={changePasswordFormRef}
				setCanSave={(bool) => setCanSave(bool)}
				setIsSubmitting={(bool) => setIsSubmitting(bool)}
				onSuccess={() => setIsEditing(false)}
			/>

		</SettingsCard>
	);
}
