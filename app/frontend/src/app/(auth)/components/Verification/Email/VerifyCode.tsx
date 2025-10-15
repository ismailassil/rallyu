import React, { useRef, useState } from 'react';
import useAPICall from '@/app/hooks/useAPICall';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import FormButton from '@/app/(auth)/components/UI/FormButton';
import { toastError } from '@/app/components/CustomToast';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import OTPCodeInput from '@/app/(onsite)/[DEPRECATED]2fa/components/OTPCodeInput';
import AnimatedComponent from '../../UI/AnimatedComponent';
import ResendCode from '../ResendCode';
import { APIError } from '@/app/(api)/APIClient';

interface VerifyCodeProps {
	token: string,
	onSuccess: () => void;
	onFailure: () => void;
	onGoBack: () => void;
}

// EMAIL
export default function VerifyCode({ token, onGoBack, onSuccess, onFailure } : VerifyCodeProps) {
	const {
		apiClient
	} = useAuth();

	const {
		isLoading: isVerifyingCode,
		executeAPICall: verifyCode
	} = useAPICall();
	const {
		isLoading: isResendingCode,
		executeAPICall: resendCode
	} = useAPICall();

	const [code, setCode] = useState(['', '', '', '', '', '']);
	const [hasError, setHasError] = useState(false);
	const inputRefs = useRef([]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const OTPJoined = code.join('');
		if (OTPJoined.length !== 6) {
			toastError('Code is required');
			setHasError(true);
			setTimeout(() => {
				setHasError(false);
			}, 1000);
			return ;
		}

		try {
			await verifyCode(() => apiClient.verify.verifyEmail(
				token,
				OTPJoined
			));
			onSuccess();
		} catch (err) {
			setHasError(true);
			setTimeout(() => {
				setHasError(false);
				if ((err as APIError).code !== 'AUTH_INVALID_CODE')
					onFailure();
			}, 1000);
			toastError((err as APIError).message);
		}
	}

	async function handleResend() {
		try {
			await resendCode(() => apiClient.verify.resendEmail(
				token
			));
		} catch (err) {
			onFailure();
			toastError((err as APIError).message);
		}
	}

	return (
		<AnimatedComponent componentKey='verify-email-verify' className='w-full max-w-lg p-11 flex flex-col gap-5 select-none'>
			{/* Header + Go Back */}
			<div className="flex gap-4 items-center mb-2">
				<button
					onClick={onGoBack}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='font-semibold text-lg sm:text-3xl inline-block'>Email</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>We&#39;ve sent a 6-digit code via SMS</p>
				</div>
			</div>

			{/* OTP Input + Verify Button + Resend Button */}
			<form className="flex flex-col gap-3" onSubmit={handleSubmit}>
				<OTPCodeInput
					code={code}
					setCode={setCode}
					inputRefs={inputRefs}
					isDisabled={isResendingCode || isVerifyingCode}
					hasError={hasError}
				/>

				<FormButton
					text='Continue'
					type='submit'
					icon={<ArrowRight size={16} />}
					disabled={isResendingCode || isVerifyingCode || code.some(d => d === '')}
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
