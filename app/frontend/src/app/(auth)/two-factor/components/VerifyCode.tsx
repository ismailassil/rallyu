/* eslint-disable @typescript-eslint/no-explicit-any */
import OTPCodeInput from "@/app/(onsite)/2fa/components/OTPCodeInput";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { METHODS_HELP, METHODS_META } from "./constants";
import FormButton from "../../components/UI/FormButton";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import useAPICall from "@/app/hooks/useAPICall";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import InputFieldError from "../../components/Form/InputFieldError";
import { toastError, toastSuccess } from "@/app/components/CustomToast";

interface VerifyCodeProps {
	method: 'TOTP' | 'SMS' | 'EMAIL';
	loginSessionMeta: { token: string, enabledMethods: string[] };
	onNext: () => void;
	onGoBack: () => void;
}

export default function VerifyCode({ method, loginSessionMeta, onNext, onGoBack } : VerifyCodeProps) {
	const router = useRouter();

	const {
		send2FACode,
		verify2FACode
	} = useAuth();

	const {
		isLoading,
		executeAPICall
	} = useAPICall();

	const [isResending, setIsResending] = useState<boolean>(false);
	const [code, setCode] = useState(['', '', '', '', '', '']);
	const [error, setError] = useState('');
	const inputRefs = useRef([]);

	async function handleSubmit() {
		if (!['TOTP', 'SMS', 'EMAIL'].includes(method)) {
			toastError('Please sign in again.');
			router.replace('/login');
			return ;
		}

		if (!code.join('')) {
			setError('Code is required');
			return ;
		} else if (code.join('').length !== 6) {
			setError('Code must be a 6-digit number');
			return ;
		}

		try {
			await executeAPICall(() => verify2FACode(
				loginSessionMeta.token,
				code.join('')
			));
			toastSuccess('Two Factor Authentication successful');
			onNext();
		} catch (err: any) {
			toastError(err.message);
		}
	}

	async function handleResend() {
		if (!['TOTP', 'SMS', 'EMAIL'].includes(method)) {
			toastError('Please sign in again.');
			router.replace('/login');
			return ;
		}

		setIsResending(true);
		try {
			await executeAPICall(() => send2FACode(
				loginSessionMeta.token,
				method
			));
			toastSuccess('Code sent!');
		} catch (err: any) {
			toastError(err.message);
		} finally {
			setIsResending(false);
		}
	}

	return (
		<>
			{/* Header + Go Back */}
			<div className="flex gap-4 items-center mb-2">
				<button
					onClick={onGoBack}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='font-semibold text-lg sm:text-3xl inline-block'>{METHODS_META[method].title}</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>{METHODS_HELP[method]}</p>
				</div>
			</div>

			{/* OTP Input + Verify Button + Resend Button */}
			<div className="flex flex-col gap-3">
				<OTPCodeInput
					code={code}
					setCode={(newCode) => {
						setCode(newCode);
						if (!newCode.join(''))
							setError('Code is required');
						else if (newCode.join('').length !== 6)
							setError('Code must be a 6-digit number');
					}}
					inputRefs={inputRefs}
					isDisabled={isLoading}
				><AnimatePresence>{error && <InputFieldError error={error} />}</AnimatePresence></OTPCodeInput>

				<FormButton
					text='Continue'
					icon={<ArrowRight size={16} />}
					onClick={handleSubmit}
					isSubmitting={isLoading && !isResending}
					disabled={isResending}
				/>

				<p className='self-center mt-2'>
					Didn&#39;t receive the code?
					<span
						onClick={handleResend}
						className={`font-semibold ml-1 ${
							(isLoading)
								? 'text-gray-500 cursor-not-allowed pointer-events-none'
								: 'text-blue-500 hover:underline cursor-pointer'
						}`}
					>
						Resend code
					</span>
				</p>
			</div>

			{/* {loginSessionMeta.enabledMethods.length > 1 && <p className='mt-12 self-center text-center'>{METHODS_HELP2[method]}<br></br><a onClick={onGoBack} className="font-semibold text-blue-500 hover:underline cursor-pointer">Try other verification methods</a></p>} */}
		</>
	);
}
