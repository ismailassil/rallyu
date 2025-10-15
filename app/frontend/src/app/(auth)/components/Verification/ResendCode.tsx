'use client';
import useResendCooldown from '@/app/hooks/useResendCooldown';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function ResendCode({
	isDisabled,
	onResend,
	onMaxResends
} : {
	isDisabled: boolean,
	onResend: () => Promise<void>,
	onMaxResends: () => void
}) {
	const t = useTranslations('auth.common');

	const {
		cooldown,
		isCooldownActive,
		startCooldown,
		isMaxResendReached
	} = useResendCooldown();

	const isResendDisabled = isDisabled || isCooldownActive || isMaxResendReached;

	const handleClick = async () => {
		if (isResendDisabled)
			return ;
		await onResend();
		startCooldown();
	};

	if (isMaxResendReached) {
		return (
			<p className='self-center mt-2 text-gray-200'>
				{t('max_resends')}
				<span
					onClick={onMaxResends}
					className='font-semibold ml-2 text-blue-500 hover:underline cursor-pointer'
				>
					{t('retry')}
				</span>
			</p>
		);
	}

	return (
		<p className='self-center mt-2'>
			{t('didnt_receive_code')}
			<span
				onClick={handleClick}
				className={`font-semibold ml-1 ${
					(isResendDisabled)
						? 'text-gray-500 cursor-not-allowed'
						: 'text-blue-500 hover:underline cursor-pointer'
				}`}
			>
				{isCooldownActive
					? `${t('resend_in')} ${cooldown}s`
					: `${t('resend_code')}`}
			</span>
		</p>
	);
}
