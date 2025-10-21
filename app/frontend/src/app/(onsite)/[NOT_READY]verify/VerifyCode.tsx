import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useAPICall from '@/app/hooks/useAPICall';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import OTPCodeInput from '@/app/(auth)/components/Form/OTPCodeInput';
import { AnimatePresence } from 'framer-motion';
import FormButton from '@/app/(auth)/components/UI/FormButton';
import { toastError, toastSuccess } from '@/app/components/CustomToast';

interface VerifyCodeProps {
	token: string,
	onNext: () => void;
	onGoBack: () => void;
}

// PHONE
export default function VerifyCode({ token } : VerifyCodeProps) {
	const {
		apiClient
	} = useAuth();

	const {
		isLoading,
		executeAPICall
	} = useAPICall();

	const [code, setCode] = useState(['', '', '', '', '', '']);
	const inputRefs = useRef([]);

	async function handleSubmit() {
		if (!code.join('')) {
			toastError('Code is required');
			return ;
		} else if (code.join('').length !== 6) {
			toastError('Code must be a 6-digit number');
			return ;
		}

		try {
			await executeAPICall(() => apiClient.auth.verifyPhone(
				token,
				code.join('')
			));
			toastSuccess('Verified Successfully => onNext');
		} catch (err: any) {
			toastError(err.message);
		}
	}

	return (
		<div className="w-full max-w-lg p-11 flex flex-col gap-5 select-none">
			{/* Header + Go Back */}
			<div className="flex gap-4 items-center mb-2">
				<button
					onClick={undefined}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='font-semibold text-lg sm:text-3xl inline-block'>Phone number</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>We&#39;ve sent a 6-digit code via SMS</p>
				</div>
			</div>

			{/* OTP Input + Verify Button + Resend Button */}
			<div className="flex flex-col gap-3">
				<OTPCodeInput
					code={code}
					setCode={setCode}
					inputRefs={inputRefs}
					isDisabled={isLoading}
				/>

				<FormButton
					text='Continue'
					icon={<ArrowRight size={16} />}
					onClick={handleSubmit}
					isSubmitting={isLoading}
				/>

				<p className='self-center mt-2'>
					Didn&#39;t receive the code?
					<span
						onClick={undefined}
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
		</div>
	);
}
