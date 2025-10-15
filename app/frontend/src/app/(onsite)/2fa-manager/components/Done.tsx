'use client';
import AnimatedComponent from '@/app/(auth)/components/UI/AnimatedComponent';
import FormButton from '@/app/(auth)/components/UI/FormButton';
import { ArrowRight, Fingerprint } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function Done({ onDashboard, onSetupAnotherMethod } : { onDashboard: () => void, onSetupAnotherMethod: () => void }) {
	const t = useTranslations('auth.twoFactorManager.done');

	return (
		<AnimatedComponent componentKey='2fa-setup-complete' className="max-w-xl flex flex-col items-center gap-14">
			{/* Header */}
			<div className='flex flex-col'>
				<Fingerprint size={64} className="bg-blue-500 rounded-full p-2 self-center mb-6"/>
				<h1 className='font-semibold text-3xl text-center mb-3'>{t('title')}</h1>
				<h1 className='font-semibold text-3xl text-center mb-3'>{t('subtitle')}</h1>
				<p className='mb-0 text-white/85 text-center'>{t('2nd_subtitle')}</p>
			</div>
			<div className='flex gap-4'>
				<FormButton
					text='Back to 2FA Manager'
					icon={<Fingerprint size={16} />}
					onClick={onSetupAnotherMethod}
					/>
				<FormButton
					text='Continue to Dashboard'
					icon={<ArrowRight size={16} />}
					onClick={onDashboard}
				/>
			</div>
		</AnimatedComponent>
	);
}
