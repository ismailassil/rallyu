'use client';
import useResendCooldown from '@/app/hooks/useResendCooldown';
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
				You&#39;ve reached the resend limit.
				<span
					onClick={onMaxResends}
					className='font-semibold ml-2 text-blue-500 hover:underline cursor-pointer'
				>
					Retry?
				</span>
			</p>
		);
	}

	return (
		<p className='self-center mt-2'>
			Didn&#39;t receive the code?
			<span
				onClick={handleClick}
				className={`font-semibold ml-1 ${
					(isResendDisabled)
						? 'text-gray-500 cursor-not-allowed'
						: 'text-blue-500 hover:underline cursor-pointer'
				}`}
			>
				{isCooldownActive
					? `Resend in ${cooldown}s`
					: 'Resend code'}
			</span>
		</p>
	);
}
