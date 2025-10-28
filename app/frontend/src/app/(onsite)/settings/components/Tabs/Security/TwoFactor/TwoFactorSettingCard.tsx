import React from 'react'
import SettingsCard from '../../../SettingsCard';
import { Fingerprint } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';

export default function TwoFactorSettingCard() {
	const router = useRouter();
	const t = useTranslations('settings.security.cards');

	const {
		loggedInUser
	} = useAuth();

	if (!loggedInUser || loggedInUser.auth_provider !== 'Local')
		return null;

	return (
		<SettingsCard
			title={t('twoFactor.title')}
			subtitle={t('twoFactor.subtitle')}
			actionButtonOptions={{
				title: t('twoFactor.button'),
				icon: <Fingerprint size={16} />,
				onClick: () => router.push('2fa-manager')
			}}
		/>
	);
}
