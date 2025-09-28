'use client';
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { METHODS_META } from "./constants";
import MethodsOverview from "./MethodsOverview";
import { Loader, Check } from "lucide-react";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { APIError } from "@/app/(api)/APIClient";
import { toastSuccess, toastError } from "@/app/components/CustomToast";
import { Toaster } from "sonner";
import MainCardWrapper from "../components/UI/MainCardWrapper";
import { motion } from "framer-motion";
import SetupTOTP from "./SetupTOTP";
import VerifySetup from "./VerifySetup";
import { simulateBackendCall } from "@/app/(api)/utils";


enum STEP {
	OVERVIEW = 'OVERVIEW',
	SETUP_TOTP = 'SETUP_TOTP',
	VERIFY_SETUP = 'VERIFY_SETUP',
	DONE = 'DONE'
}

export default function TwoFAManagerPage() {
	const router = useRouter();
	const { apiClient } = useAuth();
	const [currentStep, setCurrentStep] = useState<STEP>(STEP.OVERVIEW);
	const [selectedMethod, setSelectedMethod] = useState('');
	const [enabledMethods, setEnabledMethods] = useState(null); // null = loading, [] = none enabled, ['totp'] = totp enabled, etc.
	const [code, setCode] = useState(['', '', '', '', '', '']);
	const [isLoading, setIsLoading] = useState(false);
	const [isSendingCode, setIsSendingCode] = useState(false);
	const [isVerifyingCode, setIsVerifyingCode] = useState(false);
	const [totpSecrets, setTotpSecrets] = useState(null);
	const inputRefs = useRef([]);

	useEffect(() => {
		fetchEnabledMethods();
	}, []);

	async function fetchEnabledMethods() {
		try {
			setIsLoading(true);
			await simulateBackendCall(6000);
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
			await simulateBackendCall(6000);
			const res = await apiClient.mfaSetupInit(method);
			if (method === 'totp')
				setTotpSecrets(res);
			
			if (method === 'totp')
				setCurrentStep(STEP.SETUP_TOTP);
			else
				setCurrentStep(STEP.VERIFY_SETUP);
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
			await simulateBackendCall(6000);
			await apiClient.mfaDisableMethod(method);
			toastSuccess(`${METHODS_META[method].title} disabled successfully`);
			await fetchEnabledMethods();
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
			
			await simulateBackendCall(6000);
			await apiClient.mfaSetupVerify(selectedMethod, toVerify);
			toastSuccess(`${METHODS_META[selectedMethod].title} setup successfully!`);
			
			setCurrentStep(STEP.DONE);
			setCode(['', '', '', '', '', '']);
			setSelectedMethod('');
			setTotpSecrets(null);
			await fetchEnabledMethods();
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
			await simulateBackendCall(6000);
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
		setCurrentStep(STEP.OVERVIEW);
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

	function renderCurrentStep() {
		switch (currentStep) {
			case STEP.OVERVIEW:
				return (
					<MethodsOverview 
						methods={enabledMethods || []}
						isLoading={isLoading}
						selectedMethod={selectedMethod}
						onSetupMethod={handleSetupMethod}
						onDisableMethod={handleDisableMethod}
					/>
				);
			case STEP.SETUP_TOTP:
				return (
					<SetupTOTP 
						totpSecrets={totpSecrets}
						code={code}
						setCode={setCode}
						inputRefs={inputRefs}
						isVerifyingCode={isVerifyingCode}
						onVerify={handleVerifySetup}
						onGoBack={handleGoBack}
					/>
				);
			case STEP.VERIFY_SETUP:
				return (
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
				);
			case STEP.DONE:
				return (
					<>
						<Check className='h-22 w-22 bg-blue-500/25 rounded-full p-5 self-center'/>
						<div className='flex flex-col gap-2 px-6 items-center'>
							<h1 className='font-semibold text-3xl text-center'>2FA Setup Complete</h1>
							<p className='mb-0 text-white/85 text-center'>Your account is now protected with two-factor authentication.</p>
						</div>
						<div className="flex gap-4">
							<button className='h-11 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer' onClick={() => router.push('/dashboard')}>Continue to Dashboard</button>
							<button className='h-11 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer' onClick={() => setCurrentStep(STEP.OVERVIEW)}>Setup another method</button>
						</div>
					</>
				);
			default:
				return null;
		}
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
				<div className="h-full w-full flex justify-center items-center overflow-auto px-4 py-16">
					{renderCurrentStep()}
				</div>
			</MainCardWrapper>
			</motion.main>
		</>
	);
}
