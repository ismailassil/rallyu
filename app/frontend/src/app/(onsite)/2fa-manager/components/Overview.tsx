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

	const { loggedInUser, apiClient } = useAuth();

	const { isLoading, executeAPICall } = useAPICall();

	const [enabledMethods, setEnabledMethods] = useState<APIEnabledMethodsResponse | null>(null); // null = loading, [] = none enabled, ['totp'] = totp enabled, etc.

	useEffect(() => {
		async function fetchEnabledMethods() {
			try {
				const enabledMethods = await executeAPICall(() =>
					apiClient.mfa.fetchEnabledMethods()
				);
				setEnabledMethods(enabledMethods);
			} catch (err: any) {
				toastError(tautherr('errorCodes', { code: err.message }));
			}
		}

		fetchEnabledMethods();
	}, [apiClient.mfa, executeAPICall, loggedInUser]);

	async function handleEnable(m: 'TOTP' | 'EMAIL' | 'SMS') {
		try {
			setEnabledMethods((prev) => {
				if (prev === null) return null;
				if (prev.includes(m)) return prev;
				return [...prev, m];
			});

			await executeAPICall(() => apiClient.mfa.enableMethod(m));
		} catch (err: any) {
			if (err.message === 'AUTH_2FA_ALREADY_ENABLED') return;

			toastError(tautherr('errorCodes', { code: err.message }));
			setEnabledMethods((prev) => {
				if (prev === null) return null;
				if (prev.includes(m)) return prev.filter((value) => value != m);
				return [...prev, m];
			});
		}
	}

	async function handleDisable(m: 'TOTP' | 'EMAIL' | 'SMS') {
		try {
			setEnabledMethods((prev) => {
				if (prev === null) return null;
				if (prev.includes(m)) return prev.filter((value) => value != m);
				return [...prev, m];
			});

			await executeAPICall(() => apiClient.mfa.disableMethod(m));
		} catch (err: any) {
			if (err.message === 'AUTH_2FA_NOT_ENABLED') return;

			toastError(tautherr('errorCodes', { code: err.message }));
			setEnabledMethods((prev) => {
				if (prev === null) return null;
				if (prev.includes(m)) return prev;
				return [...prev, m];
			});
		}
	}

	async function handleUnverify(m: 'TOTP' | 'EMAIL' | 'SMS') {
		try {
			if (m === 'EMAIL')
				await executeAPICall(() => apiClient.auth.unverifyEmail());
			else if (m === 'SMS')
				await executeAPICall(() => apiClient.auth.unverifyPhone());
		} catch (err: any) {
			toastError(tautherr('errorCodes', { code: err.message }));
		}
	}

	async function handleSetup(m: 'TOTP' | 'EMAIL' | 'SMS') {
		onSetup(m);
	}

	function getMethodSubtitleDisplay(m: 'TOTP' | 'EMAIL' | 'SMS') {
		const isEmail = m === 'EMAIL';
		const isSMS = m === 'SMS';

		const verified =
			(isEmail && loggedInUser?.email_verified && loggedInUser.email) ||
			(isSMS && loggedInUser?.phone_verified && loggedInUser.phone);

		if (m === 'TOTP' || !verified) {
			return <>{t('auth.twoFactorManager.overview.cards.subtitle', { method: m })}</>;
		}

		const contactInfo: Record<string, string> = { method: m };
		if (isEmail && typeof loggedInUser?.email === 'string') {
			contactInfo.email = loggedInUser.email;
		}
		if (isSMS && typeof loggedInUser?.phone === 'string') {
			contactInfo.phone = loggedInUser.phone;
		}

		return (
			<>
				{t('auth.twoFactorManager.overview.cards.usingVerified', contactInfo)}
				<span
					onClick={() => handleUnverify(m)}
					className="font-semibold ml-2 text-blue-500/80 hover:underline cursor-pointer"
				>
					{t('auth.twoFactorManager.overview.cards.remove')}
				</span>
			</>
		);
	}

	return (
		<AnimatedComponent
			componentKey='2fa-methods-overview'
			className='flex max-w-xl flex-col items-center gap-14'
		>
			{/* Header */}
			<div className='flex flex-col'>
				<Fingerprint size={64} className='mb-6 self-center rounded-full bg-blue-500 p-2' />
				<h1 className='mb-3 text-center text-3xl font-semibold'>
					{t('auth.twoFactorManager.overview.title')}
				</h1>
				<p className='mb-0 text-center text-white/85'>
					{t('auth.twoFactorManager.overview.subtitle')}
				</p>
			</div>

			{/* Methods List */}
			<div className='flex w-full flex-col gap-4'>
				{Object.keys(METHODS_META).map((m) => {
					const isEnabled =
						enabledMethods?.includes(m as 'TOTP' | 'SMS' | 'EMAIL') || false;
					const isVerified =
						(m === 'SMS' && loggedInUser!.phone_verified) ||
						(m === 'EMAIL' && loggedInUser!.email_verified);

					return (
						<div key={METHODS_META[m].title} className='single-two-fa-card'>
							<div>{METHODS_META[m].icon}</div>
							<div>
								<h1 className='mb-1.5 flex items-center gap-4 text-sm font-semibold sm:text-base md:text-lg lg:text-2xl'>
									{t('auth.twoFactorManager.overview.cards.title', { method: m })}
								</h1>
								<p className='text-sm font-light text-white/75 lg:text-base'>
									{getMethodSubtitleDisplay(m as 'TOTP' | 'SMS' | 'EMAIL')}
								</p>
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
