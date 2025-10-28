/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, QrCode } from 'lucide-react';
import FormButton from '@/app/(auth)/components/UI/FormButton';
import { APITOTPSecrets } from '@/app/(api)/services/MfaService';
import OTPCodeInput from '../../Form/OTPCodeInput';
import { toastError } from '@/app/components/CustomToast';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import useAPICall from '@/app/hooks/useAPICall';
import AnimatedComponent from '../../UI/AnimatedComponent';
import { useTranslations } from 'next-intl';

interface TOTPVerification {
	onReset: () => void;
	onSuccess: () => void;
	onFailure: () => void;
}

export default function TOTPVerification({ onReset, onSuccess, onFailure }: TOTPVerification) {
	const t = useTranslations('auth');
	const tautherr = useTranslations('auth');

	const [token, setToken] = useState('');
	const [TOTPSecrets, setTOTPSecrets] = useState<APITOTPSecrets | null>(null);
	const [code, setCode] = useState(['', '', '', '', '', '']);
	const [hasError, setHasError] = useState(false);
	const inputRefs = useRef([]);

	const { apiClient, triggerLoggedInUserRefresh } = useAuth();

	const { isLoading, executeAPICall } = useAPICall();

	useEffect(() => {
		async function fetchTOTPSecrets() {
			try {
				const { token, secrets } = await executeAPICall(() => apiClient.mfa.setupTOTP());
				setToken(token);
				setTOTPSecrets(secrets);
			} catch (err: any) {
				onFailure();
				toastError(tautherr('errorCodes', { code: err.message }));
			}
		}

		fetchTOTPSecrets();
	}, [apiClient.mfa, executeAPICall]);

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
			await executeAPICall(() => apiClient.mfa.verifyTOTP(token, OTPJoined));
			triggerLoggedInUserRefresh();
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

	return (
		<AnimatedComponent
			componentKey='setup-totp'
			className='flex w-full max-w-lg flex-col gap-5 p-11 select-none'
		>
			{/* Header + Go Back */}
			<div className='mb-2 flex items-center gap-4'>
				<button
					onClick={onReset}
					className='cursor-pointer rounded-2xl bg-blue-500/25 p-2 transition-all duration-300 hover:bg-blue-500/90'
				>
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='inline-block text-lg font-semibold sm:text-3xl'>
						{t('verification.input.title', { method: 'TOTP' })}
					</h1>
					<p className='text-sm text-gray-300 sm:text-balance'>
						{t('verification.input.subtitle', { method: 'TOTP' })}
					</p>
				</div>
			</div>

			{/* QR Code + Manual Code + OTP Input */}
			<div>
				<div className='flex flex-col items-center gap-8 py-12'>
					{TOTPSecrets?.secret_qrcode_url ? (
						<div className='pointer-events-none overflow-hidden rounded-4xl bg-white p-3'>
							<img
								src={TOTPSecrets.secret_qrcode_url}
								alt='QR Code'
								className='h-48 w-48'
							/>
						</div>
					) : (
						<div className='flex h-48 w-48 items-center justify-center rounded-lg bg-gray-300'>
							<QrCode size={64} className='text-gray-600' />
						</div>
					)}

					<div className='text-center'>
						<p className='mb-2 text-sm text-gray-300'>
							{t('verification.input.cant_scan_qr')}
						</p>
						<code className='truncate rounded bg-gray-800 px-3 py-1 font-mono text-xs select-text sm:text-sm'>
							{TOTPSecrets?.secret_base32 || 'XXXX XXXX XXXX XXXX'}
						</code>
					</div>
				</div>

				<form className='mt-8 flex flex-col gap-3' onSubmit={handleSubmit}>
					<p className='text-center text-sm text-gray-200 sm:text-base'>
						{t('verification.verifyCode.subtitle', { method: 'TOTP' })}
					</p>

					<OTPCodeInput
						code={code}
						setCode={setCode}
						inputRefs={inputRefs}
						isDisabled={isLoading}
						hasError={hasError}
					/>

					<FormButton
						text={t('common.continue')}
						type='submit'
						icon={<ArrowRight size={16} />}
						disabled={code.some((d) => d === '')}
						isSubmitting={isLoading}
					/>
				</form>
			</div>
		</AnimatedComponent>
	);
}
