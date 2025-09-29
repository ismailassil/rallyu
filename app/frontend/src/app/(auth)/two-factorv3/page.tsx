'use client';
import React, { RefObject, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Fingerprint, Loader, LoaderCircle, Mail, RefreshCw, Smartphone } from "lucide-react";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { APIError } from "@/app/(api)/APIClient";
import { toastError, toastSuccess } from "../../components/CustomToast";

const METHODS_META: Record<string, { title: string; description: string, icon: React.JSX.Element }> = {
	totp: { title: 'Authenticator App', description: 'Google Authenticator, Authy, or similar apps', icon: <Fingerprint className='group-hover:text-blue-400 transition-all duration-900 h-14 w-14' /> },
	sms: { title: 'SMS', description: 'Receive codes via SMS', icon: <Smartphone className='group-hover:text-green-300 transition-all duration-900 h-14 w-14' /> },
	email: { title: 'Email', description: 'Receive codes via Email', icon: <Mail className='group-hover:text-yellow-300 transition-all duration-900 h-14 w-14' /> }
};

function getLoginChallengeSession() {
	try {
		const idRaw = sessionStorage.getItem('loginChallengeID');
		const methodsRaw = sessionStorage.getItem('enabledMethods');
		console.log('SESSION RAW: ', idRaw, methodsRaw);
	
		if (!idRaw || !methodsRaw) return null;

		const loginChallengeID = JSON.parse(idRaw);
		const enabledMethods = JSON.parse(methodsRaw);

		if (typeof loginChallengeID !== 'number' || !Array.isArray(enabledMethods)) {
			sessionStorage.removeItem('loginChallengeID');
			sessionStorage.removeItem('enabledMethods');
			return null;
		}

		return { loginChallengeID, enabledMethods };
	} catch {
		sessionStorage.removeItem('loginChallengeID');
		sessionStorage.removeItem('enabledMethods');
		return null;
	}
}

export default function Login2FAChallengePage() {
	const router = useRouter();
	const { send2FACode, verify2FACode } = useAuth();
	const [currentStep, setCurrentStep] = useState('method');
	const [selectedMethod, setSelectedMethod] = useState('');
	const [code, setCode] = useState(['', '', '', '', '', '']);
	const [isSendingCode, setIsSendingCode] = useState(false);
	const [isVerifyingCode, setIsVerifyingCode] = useState(false);
	// const [isLoading, setIsLoading] = useState(false);
	const inputRefs = useRef([]);

	const session = getLoginChallengeSession();

	useEffect(() => {
		if (!session) {
			console.log('LOGIN SESSION DETAILS NOT FOUND');
			router.replace('/login');
		}
	}, [session, router]);

	console.log('RENDERING LOGIN2FACHALLENGE');

	if (!session) return null;

	async function handleSelectMethod(method: string) {
		setSelectedMethod(method);

		try {
			setIsSendingCode(true);
			await send2FACode(session!.loginChallengeID, method);
			setCurrentStep('verify');
			// if (method === 'totp') {

			// }
			// 	setCurrentStep('verify');
			// else {
			// }
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.message);
			router.replace('/login');
		} finally {
			setIsSendingCode(false);
		}
	}

	async function handleVerify() {
		try {
			const toVerify = code.join('');
			// alert(`SUBMIT -  ${toVerify}`);
	
			setIsVerifyingCode(true);
			await verify2FACode(session!.loginChallengeID, selectedMethod, toVerify);
			setIsVerifyingCode(false);
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.code.includes('SESSION') ? apiErr.message + ' - Please sign in again' : apiErr.message);
			if (apiErr.code.includes('SESSION'))
				router.replace('/login');
		} finally {
			setIsVerifyingCode(false);
		}
	}

	function handleGoBack() {
		setCurrentStep('method');
	}

	async function handleResend() {
		try {
			setIsSendingCode(true);
			await send2FACode(session!.loginChallengeID, selectedMethod);
			toastSuccess('Code sent!');
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.code.includes('SESSION') ? apiErr.message + ' - Please sign in again' : apiErr.message);
			if (apiErr.code.includes('SESSION'))
				router.replace('/login');
		} finally {
			setIsSendingCode(false);
		}
	}

	function handleReturnToLogin() {

	}

	// const cardsToShow = session.enabledMethods.filter(m => Object.keys(METHODS_META).includes(m));

	return (
		<>
			<main className="pt-30 flex h-[100vh] w-full pb-10">
				<div className="flex h-full w-full justify-center overflow-auto">
					<div className="mine flex h-full w-[650px] items-start justify-center pb-20 pl-10 pr-10 pt-20 lg:items-center">
						<div className='rounded-[0px] max-w-[550px] w-full p-9 sm:p-18
									flex flex-col gap-5'>
							{currentStep === 'method' &&	<MethodSelection 
																methods={session.enabledMethods}
																selectedMethod={selectedMethod}
																isSendingCode={isSendingCode}
																onSelectMethod={handleSelectMethod}
															/>}
							{currentStep === 'verify' &&	<VerifyCode 
																methods={session.enabledMethods}
																selectedMethod={selectedMethod}
																code={code}
																setCode={setCode}
																inputRefs={inputRefs}
																isResendingCode={isSendingCode}
																isVerifyingCode={isVerifyingCode}
																onVerify={handleVerify}
																onResend={handleResend}
																onGoBack={handleGoBack}
																onReturnToLogin={handleReturnToLogin}
															/>}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}

interface MethodSelectionProps {
	methods: string[];
	selectedMethod: string;
	isSendingCode: boolean;
	onSelectMethod: (method: string) => void;
}

function MethodSelection({ methods, selectedMethod, isSendingCode, onSelectMethod } : MethodSelectionProps) {
	return (
		<div>
			{methods.map(m => {
				return (
					<button 
						key={m} 
						onClick={() => onSelectMethod(m)}
						disabled={isSendingCode}
						className="flex flex-col" >
						<div className='group w-full rounded-3xl backdrop-blur-2xl px-5 py-6 border-1 border-white/10 
							flex gap-4 items-center hover:bg-white/1 cursor-pointer transition-all duration-500'>
							{METHODS_META[m].icon}
							<div>
								<h1 className='font-semibold text-2xl mb-1.5 flex items-center gap-4'>{METHODS_META[m].title}</h1>
								<p className='font-light text-white/75'>{METHODS_META[m].description}</p>
							</div>
							{(isSendingCode && selectedMethod === m) ? <LoaderCircle size={36} className='ml-auto animate-spin'/> : <ChevronRight size={36} className='ml-auto'/>}
						</div>
					</button>
				);
			})}
		</div>
	);
}

interface VerifyCodeProps {
	methods: string[];
	selectedMethod: string;
	code: string[];
	setCode: (newCode: string[]) => void;
	inputRefs: RefObject<(HTMLInputElement | null)[]>;
	isResendingCode: boolean;
	isVerifyingCode: boolean;
	onVerify: () => void;
	onResend: () => void;
	onGoBack: () => void;
	onReturnToLogin: () => void;
}

function VerifyCode({ methods, selectedMethod, code, setCode, inputRefs, isResendingCode, isVerifyingCode, onVerify, onResend, onGoBack, onReturnToLogin } : VerifyCodeProps) {

	const METHOD_HELP: Record<string, string> = {
		totp: 'Enter the 6-digit code from your authenticator app',
		sms: `We've sent a 6-digit code via SMS`,
		email: `We've sent a 6-digit code to your Email`,
	};

	const METHOD_HELP2: Record<string, string> = {
		totp: 'Cannot access your Authenticator App?',
		sms: `Cannot access your Phone?`,
		email: `Cannot access your Email?`,
	};

	return (
		<>
			<div className='flex flex-col gap-2 mb-2'>
				<div className='flex flex-row gap-2'>
					{/* <img src='/icons/lock.svg' className='h-full w-[8%]'/> */}
					<h1 className='font-semibold text-3xl'>Two Factor Authentication</h1>
				</div>
				<p className='mb-0 text-gray-200'>{METHOD_HELP[selectedMethod]}</p>
			</div>

			<div className="flex flex-col gap-4">
				<CodeInput 
					code={code}
					setCode={setCode}
					inputRefs={inputRefs}
					isResendingCode={isResendingCode}
					isVerifyingCode={isVerifyingCode}
					onVerify={onVerify}
				/>
					<button
						onClick={onVerify}
						disabled={isResendingCode || isVerifyingCode}
						className={`h-11 rounded-lg transition-all duration-500 ${
							(code.every(digit => digit !== '') && !isVerifyingCode && !isResendingCode) ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-gray-500 cursor-not-allowed'
						}`}
					>
						{isVerifyingCode ? (
							<div className="flex justify-center items-center gap-2">
								<Loader className="w-4 h-4 animate-spin" />
								<span>Verifying...</span>
							</div >
						) : (
							<span>Verify Code</span>
						)}
					</button>
			</div>
			<p className='self-center'>Didn&#39;t get the code? <a onClick={onResend} className={`font-semibold ${
				(isResendingCode || isVerifyingCode) ? 'text-gray-500 cursor-not-allowed' : 'text-blue-500 hover:underline cursor-pointer'
			}`}>Resend code</a></p>

			{methods.length > 0 && <p className='self-center text-center'>{METHOD_HELP2[selectedMethod]}<br></br><a onClick={onGoBack} className="font-semibold text-blue-500 hover:underline cursor-pointer">Try other verification methods</a></p>}
		</>
	);
}

interface CodeInputProps {
	code: string[];
	setCode: (newCode: string[]) => void;
	inputRefs: RefObject<(HTMLInputElement | null)[]>;
	isResendingCode: boolean;
	isVerifyingCode: boolean;
	onVerify: () => void;
}

function CodeInput({ code, setCode, inputRefs, isResendingCode, isVerifyingCode } : CodeInputProps) {
	useEffect(() => {
		if (inputRefs.current?.[0])
			inputRefs.current?.[0]?.focus();
	}, []);

	function handleChange(i: number, value: string) {
		if (!/^\d*$/.test(value)) return;
	
		const newCode = [...code];
		newCode[i] = value.slice(-1);
		setCode(newCode);
	
		if (value && i < 5)
			inputRefs.current?.[i + 1]?.focus();
	}

	function handleKeyPress(i: number, e: React.KeyboardEvent) {
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
			e.preventDefault();
		if (e.key === 'Backspace' && !code[i] && i > 0) {
			inputRefs.current?.[i - 1]?.focus();
		}
	}

	function handlePaste(e: React.ClipboardEvent) {
		e.preventDefault();
		const data = e.clipboardData.getData('text').replace(/\D/g, '');
	
		if (data.length === 6) {
			const newCode = data.split('');
			setCode(newCode);
		}
	}

	return (
		<div className="flex flex-row justify-between gap-2 h-18">
			{code.map((c, i) => {
				return (
					<input 
						key={i}
						ref={(el) => { inputRefs.current[i] = el; }}
						value={code[i]}
						onChange={(e) => handleChange(i, e.target.value)}
						onKeyDown={(e) => handleKeyPress(i, e)}
						onPaste={(e) => handlePaste(e)}
						disabled={isResendingCode || isVerifyingCode}
						className="bg-white/8 border-2 border-white/10 flex-1 w-0 text-3xl text-center font-bold rounded-xl backdrop-blur-2xl focus:bg-white/20 focus:border-white/20 focus:outline-none focus-within:scale-105 transition-all duration-300 caret-transparent"
					/>
				);
			})}
		</div>
	);
}
