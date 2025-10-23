/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { METHODS_META } from './constants';
import { Fingerprint } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import useAPICall from '@/app/hooks/useAPICall';
import { APIEnabledMethodsResponse } from '@/app/(api)/services/MfaService';
import { toastError } from '@/app/components/CustomToast';
import ToggleSwitch from '../../../(auth)/components/UI/ToggleSwitch';
import AnimatedComponent from '@/app/(auth)/components/UI/AnimatedComponent';
import NoteBox from '@/app/components/NoteBox';
import { useTranslations } from 'next-intl';

interface OverviewProps {
	onSetup: (m: string) => void;
}

export default function Overview({ onSetup }: OverviewProps) {
	const t = useTranslations('');
	const tautherr = useTranslations('auth');

	const {
		loggedInUser,
		apiClient
	} = useAuth();

	const {
		isLoading,
		executeAPICall
	} = useAPICall();

	const [enabledMethods, setEnabledMethods] = useState<APIEnabledMethodsResponse | null>(null); // null = loading, [] = none enabled, ['totp'] = totp enabled, etc.

	useEffect(() => {
		async function fetchEnabledMethods() {
			console.log('fetching enabled methods');
			try {
				const enabledMethods = await executeAPICall(() => apiClient.mfa.fetchEnabledMethods());
				setEnabledMethods(enabledMethods);
			} catch (err: any) {
				toastError(err.message);
			}
		}

		fetchEnabledMethods();
	}, [apiClient.mfa, executeAPICall]);

	async function handleEnable(m: 'TOTP' | 'EMAIL' | 'SMS') {
		try {
			setEnabledMethods(prev => {
				if (prev === null) return null;
				if (prev.includes(m)) return prev;
				return [...prev, m];
			});

			await executeAPICall(() => apiClient.mfa.enableMethod(m));
		} catch (err: any) {
			if (err.message === 'AUTH_2FA_ALREADY_ENABLED')
				return ;

			toastError(tautherr('errorCodes', { code: err.message }));
			setEnabledMethods(prev => {
				if (prev === null) return null;
				if (prev.includes(m)) return prev.filter((value) => value != m);
				return [...prev, m];
			});
		}
	}

	async function handleDisable(m: 'TOTP' | 'EMAIL' | 'SMS') {
		try {
			setEnabledMethods(prev => {
				if (prev === null) return null;
				if (prev.includes(m)) return prev.filter((value) => value != m);
				return [...prev, m];
			});

			await executeAPICall(() => apiClient.mfa.disableMethod(m));
		} catch (err: any) {
			if (err.message === 'AUTH_2FA_NOT_ENABLED')
				return ;

			toastError(tautherr('errorCodes', { code: err.message }));
			setEnabledMethods(prev => {
				if (prev === null) return null;
				if (prev.includes(m)) return prev;
				return [...prev, m];
			});
		}
	}

	async function handleSetup(m: 'TOTP' | 'EMAIL' | 'SMS') {
		onSetup(m);
	}

	return (
		<AnimatedComponent componentKey='2fa-methods-overview' className="max-w-xl flex flex-col items-center gap-14">
			{/* Header */}
			<div className='flex flex-col'>
				<Fingerprint size={64} className="bg-blue-500 rounded-full p-2 self-center mb-6"/>
				<h1 className='font-semibold text-3xl text-center mb-3'>{t('auth.twoFactorManager.overview.title')}</h1>
				<p className='mb-0 text-white/85 text-center'>{t('auth.twoFactorManager.overview.subtitle')}</p>
			</div>

			{/* Methods List */}
			<div className='flex flex-col gap-4 w-full'>
				{Object.keys(METHODS_META).map(m => {
					const isEnabled = enabledMethods?.includes(m as 'TOTP' | 'SMS' | 'EMAIL') || false;
					const isVerified = (m === 'SMS' && loggedInUser!.phone_verified) || (m === 'EMAIL' && loggedInUser!.email_verified);

					return (
						<div key={METHODS_META[m].title} className="single-two-fa-card">
							<div>
								{METHODS_META[m].icon}
							</div>
							<div>
								<h1 className='font-semibold text-sm sm:text-base md:text-lg lg:text-2xl mb-1.5 flex items-center gap-4'>{t('auth.twoFactorManager.overview.cards.title', { method: m })}</h1>
								<p className='font-light text-sm lg:text-base text-white/75'>{t('auth.twoFactorManager.overview.cards.subtitle', { method: m })}</p>
							</div>
							<ToggleSwitch
								enabled={isEnabled}
								isLocked={isLoading}
								onToggle={() => {
									if (isEnabled) handleDisable(m as 'TOTP' | 'EMAIL' | 'SMS');
									else if (isVerified) handleEnable(m);
									else handleSetup(m as 'TOTP' | 'EMAIL' | 'SMS');
								}}
							/>
						</div>
					);
				})}
			</div>

			{/* Recommendation */}
			<NoteBox title={t('auth.twoFactorManager.overview.note.title')} className='md:text-lg'>
				{t('auth.twoFactorManager.overview.note.text')}
			</NoteBox>
		</AnimatedComponent>
	);
}
