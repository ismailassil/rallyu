'use client';
import React, { RefObject, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Fingerprint, LoaderCircle, Mail, RefreshCw, Smartphone, QrCode, X, Loader, Shield, ArrowLeft, Check } from "lucide-react";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { APIError } from "@/app/(api)/APIClient";
import { toastSuccess, toastError } from "@/app/components/CustomToast";
import { Toaster } from "sonner";
import MainCardWrapper from "../components/UI/MainCardWrapper";
import { motion } from "framer-motion";

const METHODS_META: Record<string, { title: string; description: string, icon: React.JSX.Element }> = {
	totp: { title: 'Authenticator App', description: 'Using Google Authenticator, Authy...', icon: <Fingerprint size={54} className='group-hover:text-blue-400 transition-all duration-900' /> },
	sms: { title: 'SMS', description: 'Receive codes via SMS', icon: <Smartphone size={54}  className='group-hover:text-green-300 transition-all duration-900' /> },
	email: { title: 'Email', description: 'Receive codes via Email', icon: <Mail size={54}  className='group-hover:text-yellow-300 transition-all duration-900' /> }
};

function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, 0));
}


export default function TwoFAManagerPage() {
	const router = useRouter();
	const { apiClient } = useAuth();
	const [currentStep, setCurrentStep] = useState('overview');
	const [selectedMethod, setSelectedMethod] = useState('');
	const [enabledMethods, setEnabledMethods] = useState(null);
	const [code, setCode] = useState(['', '', '', '', '', '']);
	const [isLoading, setIsLoading] = useState(false);
	const [isSendingCode, setIsSendingCode] = useState(false);
	const [isVerifyingCode, setIsVerifyingCode] = useState(false);
	const [totpSecrets, setTotpSecrets] = useState(null);
	const inputRefs = useRef([]);

	useEffect(() => {
		getEnabledMethods();
	}, []);

	async function getEnabledMethods() {
		try {
			setIsLoading(true);
			await delay(6000);
			const enabledMethods = await apiClient.mfaEnabledMethods();
			setEnabledMethods(enabledMethods);
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.message);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleSetupMethod(method: string) {
		setSelectedMethod(method);
		
		try {
			setIsLoading(true);
			await delay(6000);
			const res = await apiClient.mfaSetupInit(method);
			if (method === 'totp')
				setTotpSecrets(res);
			
			if (method === 'totp')
				setCurrentStep('setup-totp');
			else
				setCurrentStep('verify-setup');
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.message);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleDisableMethod(method: string) {
		setSelectedMethod(method);

		if (!confirm(`Are you sure you want to disable ${METHODS_META[method].title}?`)) {
			return;
		}

		try {
			setIsLoading(true);
			await delay(6000);
			await apiClient.mfaDisableMethod(method);
			toastSuccess(`${METHODS_META[method].title} disabled successfully`);
			await getEnabledMethods();
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.message);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleVerifySetup() {
		try {
			const toVerify = code.join('');
			setIsVerifyingCode(true);
			
			await delay(6000);
			await apiClient.mfaSetupVerify(selectedMethod, toVerify);
			toastSuccess(`${METHODS_META[selectedMethod].title} setup successfully!`);
			
			setCurrentStep('done');
			setCode(['', '', '', '', '', '']);
			setSelectedMethod('');
			setTotpSecrets(null);
			await getEnabledMethods();
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.message);
		} finally {
			setIsVerifyingCode(false);
		}
	}

	async function handleResendCode() {
		try {
			setIsSendingCode(true);
			await delay(6000);
			await apiClient.mfaSetupInit(selectedMethod);
			toastSuccess('Code sent!');
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.message);
		} finally {
			setIsSendingCode(false);
		}
	}

	function handleGoBack() {
		setCurrentStep('overview');
		setSelectedMethod('');
		setCode(['', '', '', '', '', '']);
		setTotpSecrets(null);
	}

	console.log('RENDERING SETUP 2FA PAGE', isLoading, enabledMethods);

	if (enabledMethods === null) {
		return (
			<>
				<Toaster position='bottom-right' visibleToasts={1} />
				<main className="pt-30 flex h-[100vh] w-full pb-10">
					<div className="flex h-full w-full justify-center items-center">
						<Loader size={24} className="animate-spin" />
					</div>
				</main>
			</>
		);
	}

	return (
		<>
			<Toaster position='bottom-right' visibleToasts={1} />
			<motion.main
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
				className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
			>
			<MainCardWrapper className="h-full w-full custom-scrollbar font-funnel-display">
				<div className="h-full w-full sm:flex justify-center items-center overflow-auto px-6 py-16">
					{/* <h1>-----------------------------------------------------------------------------</h1> */}
					{currentStep === 'overview' && (
						<MethodsOverview 
							methods={enabledMethods}
							isLoading={isLoading}
							selectedMethod={selectedMethod}
							onSetupMethod={handleSetupMethod}
							onDisableMethod={handleDisableMethod}
						/>
					)}
					{/* <h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1>
					<h1>Some Content</h1> */}
					{/* <h1>-----------------------------------------------------------------------------</h1> */}
				</div>
				{/* <div className="flex h-full w-full justify-center items-center py-20 px-20">
						<div className=''>
							{currentStep === 'overview' && (
								<MethodsOverview 
									methods={enabledMethods}
									isLoading={isLoading}
									selectedMethod={selectedMethod}
									onSetupMethod={handleSetupMethod}
									onDisableMethod={handleDisableMethod}
								/>
							)}
							{currentStep === 'setup-totp' && (
								<SetupTOTP 
									totpSecrets={totpSecrets}
									code={code}
									setCode={setCode}
									inputRefs={inputRefs}
									isVerifyingCode={isVerifyingCode}
									onVerify={handleVerifySetup}
									onGoBack={handleGoBack}
								/>
							)}
							{currentStep === 'verify-setup' && (
								<VerifySetup 
									selectedMethod={selectedMethod}
									code={code}
									setCode={setCode}
									inputRefs={inputRefs}
									isResendingCode={isSendingCode}
									isVerifyingCode={isVerifyingCode}
									onVerify={handleVerifySetup}
									onResend={handleResendCode}
									onGoBack={handleGoBack}
								/>
							)}
							{currentStep === 'done' && (
								<>
									<Check className='h-22 w-22 bg-blue-500/25 rounded-full p-5 self-center'/>
									<div className='flex flex-col gap-2 px-6 items-center'>
										<h1 className='font-semibold text-3xl text-center'>2FA Setup Complete</h1>
										<p className='mb-0 text-white/85 text-center'>Your account is now protected with two-factor authentication.</p>
									</div>
									<div className="flex gap-4">
										<button className='h-11 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer' onClick={() => router.push('/dashboard')}>Continue to Dashboard</button>
										<button className='h-11 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer' onClick={() => setCurrentStep('overview')}>Setup another method</button>
									</div>
								</>
							)}
						</div>
				</div> */}
			</MainCardWrapper>
			</motion.main>
		</>
	);
}

interface MethodsOverviewProps {
	methods: string[];
	isLoading: boolean;
	selectedMethod: string;
	onSetupMethod: (method: string) => void;
	onDisableMethod: (method: string) => void;
}

function MethodsOverview({ methods, isLoading, selectedMethod, onSetupMethod, onDisableMethod }: MethodsOverviewProps) {
	return (
		<div className="max-w-[575px] flex flex-col items-center gap-14">
			{/* Header */}
			<div className='flex flex-col'>
				<Fingerprint size={64} className="bg-blue-500 rounded-full p-2 self-center mb-6"/>
				<h1 className='font-semibold text-3xl text-center mb-3'>Two-Factor Authentication</h1>
				<p className='mb-0 text-white/85 text-center'>Add an extra layer of security to your account by choosing your preferred verification method.</p>
			</div>

			{/* Methods List */}
			<div className='flex flex-col gap-4 w-full'>
				{Object.keys(METHODS_META).map(m => {
					const isEnabled = methods.includes(m);
					const isSelectedMethod = selectedMethod === m;
					console.log('selectedMethod', selectedMethod, 'isSelected ? ', isSelectedMethod);
					return (
						<div key={METHODS_META[m].title} className="single-two-fa-card">
							<div>
								{METHODS_META[m].icon}
							</div>
							<div>
								<h1 className='font-semibold text-sm sm:text-base md:text-lg lg:text-2xl mb-1.5 flex items-center gap-4'>{METHODS_META[m].title}</h1>
								<p className='font-light text-sm lg:text-base text-white/75'>{METHODS_META[m].description}</p>
							</div>
							<button
								onClick={isEnabled ? () => onDisableMethod(m) : () => onSetupMethod(m)}
								disabled={isLoading}
								className={`border-1 rounded-full px-3.5 py-1.5 font-medium backdrop-blur-xs h-10 ml-auto transition-all duration-500
									${isEnabled
									? "border-red-500/20 bg-red-500/2 text-red-400 hover:bg-red-500/75 hover:text-white"
									: "border-blue-500/30 bg-blue-500/2 text-blue-400 hover:bg-blue-500 hover:text-white"
									} ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
							>
								<div className="flex items-center gap-2 justify-center">
									{(isLoading && isSelectedMethod) ? (
										<LoaderCircle size={16} className="animate-spin ml-auto" />
									) : isEnabled ? <X size={16} className="ml-auto" /> : <Fingerprint size={16} className="ml-auto" />}
									<span>{isEnabled ? "Disable" : "Setup"}</span>
								</div>
							</button>
						</div>
					);
				})}
			</div>

			{/* Recommendation */}
			<div className='bg-blue-500/6 px-6 py-4 rounded-2xl backdrop-blur-2xl border-1 border-white/8 text-lg text-blue-400'>
				<p><span className='font-bold'>Recommendation: </span>Authenticator apps provide the highest security and work without internet connection.</p>
			</div>
		</div>
	);
}

interface SetupTOTPProps {
	totpSecrets: { secret_base32: string, secret_qrcode_url: string } | null;
	code: string[];
	setCode: (newCode: string[]) => void;
	inputRefs: RefObject<(HTMLInputElement | null)[]>;
	isVerifyingCode: boolean;
	onVerify: () => void;
	onGoBack: () => void;
}

function SetupTOTP({ totpSecrets, code, setCode, inputRefs, isVerifyingCode, onVerify, onGoBack }: SetupTOTPProps) {
	return (
		<div className="px-18">
			<div className="flex gap-4 mb-4 items-center">
				<button 
					onClick={onGoBack}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div className='flex flex-col'>
					<h1 className='font-semibold text-3xl'>Setup Authenticator App</h1>
					<p className='mb-0 text-gray-200'>Scan the QR code with your authenticator app</p>
				</div>
			</div>

			<div className="flex flex-col">
				<div className="flex flex-col items-center gap-8 py-12 rounded-4xl">
					{totpSecrets?.secret_qrcode_url ? (
						<div className="bg-white p-4 rounded-4xl">
							<img src={totpSecrets.secret_qrcode_url} alt="QR Code" className="w-48 h-48" />
						</div>
					) : (
						<div className="w-48 h-48 bg-gray-300 rounded-lg flex items-center justify-center">
							<QrCode size={64} className="text-gray-600" />
						</div>
					)}
					
					<div className="text-center">
						<p className="text-sm text-gray-300 mb-2">Can&#39;t scan? Enter this code manually:</p>
						<code className="bg-gray-800 px-3 py-1 rounded text-sm font-mono">
							{totpSecrets?.secret_base32 || 'XXXX XXXX XXXX XXXX'}
						</code>
					</div>
				</div>
				
				
				<div className="flex flex-col gap-4">
					<p className="text-center text-gray-200">Enter the 6-digit code from your authenticator app</p>
					<CodeInput 
						code={code}
						setCode={setCode}
						inputRefs={inputRefs}
						isResendingCode={false}
						isVerifyingCode={isVerifyingCode}
					/>
					<button
						onClick={onVerify}
						disabled={isVerifyingCode || !code.every(digit => digit !== '')}
						className={`h-11 rounded-lg transition-all duration-500 ${
							(code.every(digit => digit !== '') && !isVerifyingCode) 
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
				</div>
			</div>
		</div>
	);
}

interface VerifySetupProps {
	selectedMethod: string;
	code: string[];
	setCode: (newCode: string[]) => void;
	inputRefs: RefObject<(HTMLInputElement | null)[]>;
	isResendingCode: boolean;
	isVerifyingCode: boolean;
	onVerify: () => void;
	onResend: () => void;
	onGoBack: () => void;
}

function VerifySetup({ selectedMethod, code, setCode, inputRefs, isResendingCode, isVerifyingCode, onVerify, onResend, onGoBack } : VerifySetupProps) {
	const METHOD_HELP: Record<string, string> = {
		sms: `We've sent a 6-digit code to your phone number`,
		email: `We've sent a 6-digit code to your email address`,
	};

	return (
		<div className="px-18">
			<div className="flex gap-4 mb-12 items-center">
				<button 
					onClick={onGoBack}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div className='flex flex-col'>
					<h1 className='font-semibold text-3xl'>Setup {METHODS_META[selectedMethod].title}</h1>
					<p className='mb-0 text-gray-200'>{METHOD_HELP[selectedMethod]}</p>
				</div>
			</div>

			<div className="flex flex-col gap-6">
				<CodeInput 
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
							<Loader className="w-4 h-4 animate-spin" />
							<span>Verifying...</span>
						</div>
					) : (
						<span>Complete Setup</span>
					)}
				</button>

				<p className='self-center'>
					Didn&#39;t receive the code? 
					<a 
						onClick={onResend} 
						className={`font-semibold ml-1 ${
							(isResendingCode || isVerifyingCode) 
								? 'text-gray-500 cursor-not-allowed' 
								: 'text-blue-500 hover:underline cursor-pointer'
						}`}
					>
						Resend code
					</a>
				</p>
			</div>
		</div>
	);
}

interface CodeInputProps {
	code: string[];
	setCode: (newCode: string[]) => void;
	inputRefs: RefObject<(HTMLInputElement | null)[]>;
	isResendingCode: boolean;
	isVerifyingCode: boolean;
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
