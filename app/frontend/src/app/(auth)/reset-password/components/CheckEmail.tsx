import { ArrowLeft, LoaderCircle } from "lucide-react";
import OTPCodeInput from "@/app/(onsite)/2fa/components/OTPCodeInput";
import { RefObject } from "react";

interface CheckEmailProps {
	code: string[];
	setCode: (newCode: string[]) => void;
	inputRefs: RefObject<(HTMLInputElement | null)[]>;
	isResendingCode: boolean;
	isVerifyingCode: boolean;
	onVerify: () => void;
	onResend: () => void;
	onGoBack: () => void;
}

export function CheckEmail({ code, setCode, inputRefs, isResendingCode, isVerifyingCode, onVerify, onResend, onGoBack } : CheckEmailProps) {
	return (
		<div className="w-full max-w-[460px] select-none">
			{/* Header + Go Back */}
			<div className="flex gap-4 items-center mb-8">
				<button 
					onClick={onGoBack}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='font-semibold text-lg sm:text-3xl inline-block'>Check your Email!</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>We&#39;ve sent a 6-digit code to your email address</p>
				</div>
			</div>

			{/* OTP Input + Verify Button + Resend Button */}
			<div className="flex flex-col gap-6">
				<OTPCodeInput 
					code={code}
					setCode={setCode}
					inputRefs={inputRefs}
					isResendingCode={isResendingCode}
					isVerifyingCode={isVerifyingCode}
				/>
				
				<button
					onClick={onVerify}
					disabled={isResendingCode || isVerifyingCode || !code.every(digit => digit !== '')}
					className={`h-11 rounded-lg transition-all duration-500 ${
						(code.every(digit => digit !== '') && !isVerifyingCode && !isResendingCode) 
							? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
							: 'bg-gray-500 cursor-not-allowed'
					}`}
				>
					{isVerifyingCode ? (
						<div className="flex justify-center items-center gap-2">
							<LoaderCircle className="w-4 h-4 animate-spin" />
							<span>Verifying...</span>
						</div>
					) : (
						<span>Complete Setup</span>
					)}
				</button>

				<p className='self-center'>
					Didn&#39;t receive the code? 
					<span 
						onClick={
							(isResendingCode || isVerifyingCode)
							? undefined
							: onResend
						}
						className={`font-semibold ml-1 ${
							(isResendingCode || isVerifyingCode) 
								? 'text-gray-500 cursor-not-allowed' 
								: 'text-blue-500 hover:underline cursor-pointer'
						}`}
					>
						Resend code
					</span>
				</p>
			</div>
		</div>
	);
}
