import React, { useRef, useState } from 'react';
import useAPICall from '@/app/hooks/useAPICall';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import FormButton from '@/app/(auth)/components/UI/FormButton';
import { toastError } from '@/app/components/CustomToast';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import OTPCodeInput from '../../Form/OTPCodeInput';
import AnimatedComponent from '../../UI/AnimatedComponent';
import ResendCode from '../ResendCode';
import { useTranslations } from 'next-intl';

interface VerifyCodeProps {
	token: string;
	onSuccess: () => void;
	onFailure: () => void;
	onGoBack: () => void;
}

// EMAIL
export default function VerifyCode({ token, onGoBack, onSuccess, onFailure }: VerifyCodeProps) {
	const t = useTranslations('auth');
	const tautherr = useTranslations('auth');

	const { apiClient } = useAuth();

	const { isLoading: isVerifyingCode, executeAPICall: verifyCode } = useAPICall();
	const { isLoading: isResendingCode, executeAPICall: resendCode } = useAPICall();

	const [code, setCode] = useState(['', '', '', '', '', '']);
	const [hasError, setHasError] = useState(false);
	const inputRefs = useRef([]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const OTPJoined = code.join('');
		if (OTPJoined.length !== 6) {
			setHasError(true);
			setTimeout(() => {
				setHasError(false);
			}, 1000);
			return;
		}

		try {
			await verifyCode(() => apiClient.verify.verifyEmail(token, OTPJoined));
			onSuccess();
		} catch (err: any) {
			if (err.message === 'AUTH_INVALID_CODE') {
				setHasError(true);
				setTimeout(() => setHasError(false), 1000);
			} else {
				toastError(tautherr('errorCodes', { code: err.message }));
				onFailure();
			}
		}
	}

	async function handleResend() {
		try {
			await resendCode(() => apiClient.verify.resendEmail(token));
		} catch (err: any) {
			onFailure();
			toastError(tautherr('errorCodes', { code: err.message }));
		}
	}

	return (
		<AnimatedComponent
			componentKey='verify-email-verify'
			className='flex w-full max-w-lg flex-col gap-5 p-11 select-none'
		>
			{/* Header + Go Back */}
			<div className='mb-2 flex items-center gap-4'>
				<button
					onClick={onGoBack}
					className='cursor-pointer rounded-2xl bg-blue-500/25 p-2 transition-all duration-300 hover:bg-blue-500/90'
				>
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='inline-block text-lg font-semibold sm:text-3xl'>
						{t('verification.verifyCode.title', { method: 'EMAIL' })}
					</h1>
					<p className='text-sm text-gray-300 sm:text-balance'>
						{t('verification.verifyCode.subtitle', { method: 'EMAIL' })}
					</p>
				</div>
			</div>

			{/* OTP Input + Verify Button + Resend Button */}
			<form className='flex flex-col gap-3' onSubmit={handleSubmit}>
				<OTPCodeInput
					code={code}
					setCode={setCode}
					inputRefs={inputRefs}
					isDisabled={isResendingCode || isVerifyingCode}
					hasError={hasError}
				/>

				<FormButton
					text={t('common.continue')}
					type='submit'
					icon={<ArrowRight size={16} />}
					disabled={
						isResendingCode || isVerifyingCode || code.some((d) => d === '') || hasError
					}
					isSubmitting={isVerifyingCode}
				/>

				<ResendCode
					isDisabled={isVerifyingCode || isResendingCode}
					onResend={handleResend}
					onMaxResends={onFailure}
				/>
			</form>
		</AnimatedComponent>
	);
}
