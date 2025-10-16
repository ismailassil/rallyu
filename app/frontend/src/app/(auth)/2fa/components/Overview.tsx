import React, { useState } from 'react';
import { METHODS_META } from './constants';
import { Fingerprint, LoaderCircle, ChevronRight } from 'lucide-react';
import { toastError, toastSuccess } from '@/app/components/CustomToast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import useAPICall from '@/app/hooks/useAPICall';
import { APIError } from '@/app/(api)/APIClient';
import AnimatedComponent from '../../components/UI/AnimatedComponent';
import { useTranslations } from 'next-intl';

interface MethodsOverviewProps {
	loginSessionMeta: { token: string, enabledMethods: string[] }
	onSuccess: (m: string) => void;
	onFailure: () => void;
}

export default function Overview({ loginSessionMeta, onSuccess, onFailure }: MethodsOverviewProps) {
	const router = useRouter();

	const t = useTranslations('auth.twoFactorAtLogin.overview');

	const {
		apiClient
	} = useAuth();

	const {
		isLoading,
		executeAPICall
	} = useAPICall();

	const [selectedMethod, setSelectedMethod] = useState<'TOTP' | 'SMS' | 'EMAIL' | null>(null);

	async function handleSelect(m: 'TOTP' | 'SMS' | 'EMAIL') {
		if (!['TOTP', 'SMS', 'EMAIL'].includes(m)) {
			toastError('Please sign in again.');
			router.replace('/login');
			return ;
		}

		setSelectedMethod(m);
		try {
			await executeAPICall(() => apiClient.auth.select2FAMethod(
				loginSessionMeta.token,
				m
			));
			if (m !== 'TOTP')
				toastSuccess('Code sent');
			onSuccess(m);
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.message);
			onFailure();
		}
		setSelectedMethod(null);
	}

	const ORDER = ['TOTP', 'EMAIL', 'SMS'];

	return (
		<AnimatedComponent componentKey='2fa-chall-overview' className='w-full max-w-2xl p-11 flex flex-col gap-5'>
			{/* Header */}
			<div className='flex flex-col mb-12'>
				<Fingerprint size={64} className="bg-blue-500 rounded-full p-2 self-center mb-6"/>
				<h1 className='font-semibold text-3xl text-center mb-3'>{t('title')}</h1>
				<p className='mb-0 text-white/85 text-center'>{t('subtitle')}</p>
			</div>

			{/* Methods List */}
			<div className='flex flex-col gap-4 w-full'>
				{ORDER.filter(m => loginSessionMeta.enabledMethods.includes(m))
					.map(m => {
						return (
							<button
								key={m}
								onClick={() => handleSelect(m as 'TOTP' | 'SMS' | 'EMAIL')}
								disabled={isLoading}
								className={`single-two-fa-card ${isLoading ? 'cursor-not-allowed pointer-events-none brightness-75' : 'cursor-pointer'}`}
							>
								<div className='w-full flex justify-between items-center gap-0'>
									<div className='flex gap-4 items-center'>
										{METHODS_META[m].icon}
										<div>
											<h1 className='font-semibold text-lg sm:text-base md:text-lg lg:text-2xl mb-1.5 flex items-center gap-4'>
												{t('cards.title', { method: m })}
											</h1>
											<p className='font-light text-sm lg:text-base text-white/75'>
												{t('cards.subtitle', { method: m })}
											</p>
										</div>
									</div>
									{(isLoading && selectedMethod === m) ? <LoaderCircle size={36} className='ml-auto animate-spin'/> : <ChevronRight size={36} className='ml-auto'/>}
								</div>
							</button>
						);
				})}
			</div>
		</AnimatedComponent>
	);
}
