import OTPCodeInput from "@/app/(onsite)/[DEPRECATED]2fa/components/OTPCodeInput";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import FormButton from "../../UI/FormButton";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import useAPICall from "@/app/hooks/useAPICall";
import { toastError } from "@/app/components/CustomToast";
import { APIError } from "@/app/(api)/APIClient";
import ResendCode from "../ResendCode";
import AnimatedComponent from "../../UI/AnimatedComponent";

interface VerifyCodeProps {
	selectedMethod: string;
	loginSessionMeta: { token: string, enabledMethods: string[] };
	onSuccess: () => void;
	onFailure: () => void;
	onGoBack: () => void;
}

export default function VerifyCode({ selectedMethod, loginSessionMeta, onSuccess, onFailure, onGoBack } : VerifyCodeProps) {

	const {
		apiClient,
		loginUsing2FA
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

	async function handleSubmit() {
		// if (!['TOTP', 'SMS', 'EMAIL'].includes(method)) {
		// 	toastError('Please sign in again.');
		// 	router.replace('/login');
		// 	return ;
		// }

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
			await verifyCode(() => loginUsing2FA(
				loginSessionMeta.token,
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
		// if (!['TOTP', 'SMS', 'EMAIL'].includes(method)) {
		// 	toastError('Please sign in again.');
		// 	router.replace('/login');
		// 	return ;
		// }

		try {
			await resendCode(() => apiClient.auth.resend2FACode(
				loginSessionMeta.token,
			));
		} catch (err) {
			onFailure();
			toastError((err as APIError).message);
		}
	}

	return (
		<AnimatedComponent componentKey='2fa-chall-verify' className='w-full max-w-lg p-11 flex flex-col gap-5'>
			{/* Header + Go Back */}
			<div className="flex gap-4 items-center mb-2">
				<button
					onClick={onGoBack}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='font-semibold text-lg sm:text-[27px] inline-block'>Two-Factor Authentication</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>Enter the 6-digit code to complete verification</p>
				</div>
			</div>

			{/* OTP Input + Verify Button + Resend Button */}
			<div className="flex flex-col gap-3">
				<OTPCodeInput
					code={code}
					setCode={setCode}
					inputRefs={inputRefs}
					isDisabled={isResendingCode || isVerifyingCode}
					hasError={hasError}
				/>

				<FormButton
					text='Continue'
					icon={<ArrowRight size={16} />}
					onClick={handleSubmit}
					disabled={isResendingCode || isVerifyingCode || code.some(d => d === '')}
					isSubmitting={isVerifyingCode}
				/>

				{selectedMethod !== 'TOTP' && (
					<ResendCode
						isDisabled={isVerifyingCode || isResendingCode}
						onResend={handleResend}
						onMaxResends={onFailure}
					/>
				)}
			</div>

			{loginSessionMeta.enabledMethods.length > 1 && <p className='mt-12 self-center text-center'>Can&#39;t access this method?<br></br><a onClick={onGoBack} className="font-semibold text-blue-500 hover:underline cursor-pointer">Try other verification methods</a></p>}
		</AnimatedComponent>
	);
}
