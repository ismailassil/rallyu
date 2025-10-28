import OTPCodeInput from '../../Form/OTPCodeInput';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import FormButton from '../../UI/FormButton';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import useAPICall from '@/app/hooks/useAPICall';
import { toastError } from '@/app/components/CustomToast';
import ResendCode from '../ResendCode';
import AnimatedComponent from '../../UI/AnimatedComponent';
import { useTranslations } from 'next-intl';

interface VerifyCodeProps {
	selectedMethod: string;
	loginSessionMeta: { token: string; enabledMethods: string[] };
	onSuccess: () => void;
	onFailure: () => void;
	onGoBack: () => void;
}

export default function VerifyCode({
	selectedMethod,
	loginSessionMeta,
	onSuccess,
	onFailure,
	onGoBack,
}: VerifyCodeProps) {
	const t = useTranslations('auth');
	const tautherr = useTranslations('auth');

	const { apiClient, loginUsing2FA } = useAuth();

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
			await verifyCode(() => loginUsing2FA(loginSessionMeta.token, OTPJoined));
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
			await resendCode(() => apiClient.auth.resend2FACode(loginSessionMeta.token));
		} catch (err: any) {
			onFailure();
			toastError(tautherr('errorCodes', { code: err.message }));
		}
	}

	return (
		<AnimatedComponent
			componentKey='2fa-chall-verify'
			className='flex w-full max-w-lg flex-col gap-5 p-11'
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
					<h1 className='inline-block text-lg font-semibold sm:text-[27px]'>
						{t('twoFactorAtLogin.verifyCode.title')}
					</h1>
					<p className='text-sm text-gray-300 sm:text-balance'>
						{t('twoFactorAtLogin.verifyCode.subtitle', { method: selectedMethod })}
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

				{selectedMethod !== 'TOTP' && (
					<ResendCode
						isDisabled={isVerifyingCode || isResendingCode}
						onResend={handleResend}
						onMaxResends={onFailure}
					/>
				)}
			</form>

			{loginSessionMeta.enabledMethods.length > 1 && (
				<p className='mt-12 self-center text-center'>
					{t('twoFactorAtLogin.verifyCode.cannot_access', { method: selectedMethod })}
					<br></br>
					<a
						onClick={onGoBack}
						className='cursor-pointer font-semibold text-blue-500 hover:underline'
					>
						{t('twoFactorAtLogin.verifyCode.other_method')}
					</a>
				</p>
			)}
		</AnimatedComponent>
	);
}
