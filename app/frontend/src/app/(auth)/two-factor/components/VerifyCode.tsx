import OTPCodeInput from "@/app/(onsite)/2fa/components/OTPCodeInput";
import { ArrowLeft, LogIn } from "lucide-react";
import { RefObject } from "react";
import { METHODS_META } from "./constants";
import LoadingButton from "./LoadingButton";
import FormButton from "../../components/UI/FormButton";

interface VerifyCodeProps {
	methods: string[];
	selectedMethod: string;
	code: string[];
	setCode: (newCode: string[]) => void;
	inputRefs: RefObject<(HTMLInputElement | null)[]>;
	isResendingCode: boolean;
	isVerifyingCode: boolean;
	onVerifyClick: () => void;
	onResendClick: (method: string) => void;
	onGoBack: () => void;
}

export default function VerifyCode({ methods, selectedMethod, code, setCode, inputRefs, isResendingCode, isVerifyingCode, onVerifyClick, onResendClick, onGoBack } : VerifyCodeProps) {

	const METHOD_HELP: Record<string, string> = {
		TOTP: 'Enter the 6-digit code from your authenticator app',
		SMS: `We've sent a 6-digit code via SMS`,
		EMAIL: `We've sent a 6-digit code to your Email`,
	};

	const METHOD_HELP2: Record<string, string> = {
		TOTP: 'Cannot access your Authenticator App?',
		SMS: `Cannot access your Phone?`,
		EMAIL: `Cannot access your Email?`,
	};

	return (
		<>
			{/* Header + Go Back */}
			<div className="flex gap-4 items-center w-full">
				<button 
					onClick={onGoBack}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='font-semibold text-lg sm:text-3xl inline-block'>{METHODS_META[selectedMethod].title}</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>{METHOD_HELP[selectedMethod]}</p>
				</div>
			</div>

			{/* OTP Input + Verify Button + Resend Button */}
			<div className="w-full flex flex-col gap-4">
				<OTPCodeInput 
					code={code}
					setCode={setCode}
					inputRefs={inputRefs}
					isResendingCode={isResendingCode}
					isVerifyingCode={isVerifyingCode}
				/>
				{/* <LoadingButton
					onClick={onVerifyClick}
					text="Verify Code"
					loadingText="Verifying..."
					disabled={isResendingCode || isVerifyingCode || !code.every(digit => digit !== '')}
					loading={isVerifyingCode}
				/> */}
				<FormButton
					text='Verify Code'
					icon={<LogIn size={16} />}
					type='button'
				/>
				<p className='self-center'>Didn&#39;t get the code? <span onClick={() => onResendClick(selectedMethod)} className={`font-semibold ${
					(isResendingCode || isVerifyingCode) ? 'text-gray-500 cursor-not-allowed pointer-events-none' : 'text-blue-500 hover:underline cursor-pointer'
				}`}>Resend code</span></p>
			</div>

			{methods.length > 1 && <p className='self-center text-center'>{METHOD_HELP2[selectedMethod]}<br></br><a onClick={onGoBack} className="font-semibold text-blue-500 hover:underline cursor-pointer">Try other verification methods</a></p>}
		</>
	);
}