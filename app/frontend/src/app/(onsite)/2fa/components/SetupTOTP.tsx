import React from "react";
import { RefObject } from "react";
import { ArrowLeft, ArrowRight, LoaderCircle, QrCode } from "lucide-react";
import OTPCodeInput from "./OTPCodeInput";
import FormButton from "@/app/(auth)/components/UI/FormButton";

interface SetupTOTPProps {
	totpSecrets: { secret_base32: string, secret_qrcode_url: string } | null;
	code: string[];
	setCode: (newCode: string[]) => void;
	inputRefs: RefObject<(HTMLInputElement | null)[]>;
	isVerifyingCode: boolean;
	onVerify: () => void;
	onGoBack: () => void;
}

export default function SetupTOTP({ totpSecrets, code, setCode, inputRefs, isVerifyingCode, onVerify, onGoBack }: SetupTOTPProps) {
	return (
		<div className="w-full max-w-lg p-11 flex flex-col gap-5 select-none">
			{/* Header + Go Back */}
			<div className="flex gap-4 items-center mb-2">
				<button
					onClick={onGoBack}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='font-semibold text-lg sm:text-3xl inline-block'>Authenticator App</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>Scan the QR code with your authenticator app</p>
				</div>
			</div>

			{/* QR Code + Manual Code + OTP Input */}
			<div className="">
				{/* QR Code + Manual Code */}
				<div className="flex flex-col items-center gap-8 py-12">
					{totpSecrets?.secret_qrcode_url ? (
						<div className="bg-white p-3 rounded-4xl overflow-hidden pointer-events-none">
							<img src={totpSecrets.secret_qrcode_url} alt="QR Code" className="w-48 h-48" />
						</div>
					) : (
						<div className="w-48 h-48 bg-gray-300 rounded-lg flex items-center justify-center">
							<QrCode size={64} className="text-gray-600" />
						</div>
					)}

					<div className="text-center">
						<p className="text-sm text-gray-300 mb-2">Can&#39;t scan? Enter this code manually:</p>
						<code className="bg-gray-800 px-3 py-1 rounded text-xs sm:text-sm font-mono select-text truncate">
							{totpSecrets?.secret_base32 || 'XXXX XXXX XXXX XXXX'}
						</code>
					</div>
				</div>

				{/* OTP Input + Verify Button */}
				<div className="flex flex-col gap-3 mt-8">
					<p className="text-center text-gray-200 text-sm sm:text-base">Enter the 6-digit code from your authenticator app</p>
					<OTPCodeInput
						code={code}
						setCode={setCode}
						inputRefs={inputRefs}
						isResendingCode={false}
						isVerifyingCode={isVerifyingCode}
					/>
					{/* <button
						onClick={onVerify}
						disabled={isVerifyingCode || !code.every(digit => digit !== '')}
						className={`h-11 rounded-lg transition-all duration-500 ${
							(code.every(digit => digit !== '') && !isVerifyingCode)
								? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
								: 'bg-gray-500 cursor-not-allowed pointer-events-none'
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
					</button> */}
					<FormButton
						text='Continue'
						icon={<ArrowRight size={16} />}
						onClick={onVerify}
						isSubmitting={isVerifyingCode}
						disabled={isVerifyingCode || !code.every(digit => digit !== '')}
					/>
				</div>
			</div>
		</div>
	);
}
