'use client';
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { METHODS_META } from "./components/constants";
import MethodsOverview from "./components/MethodsOverview";
import { Loader, Check } from "lucide-react";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { APIError } from "@/app/(api)/APIClient";
import { toastSuccess, toastError } from "@/app/components/CustomToast";
import MainCardWrapper from "../components/UI/MainCardWrapper";
import { motion } from "framer-motion";
import SetupTOTP from "./components/SetupTOTP";
import VerifySetup from "./components/VerifySetup";
import { APIEnabledMethodsResponse, APITOTPSecrets } from "@/app/(api)/services/MfaService";


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
	const [enabledMethods, setEnabledMethods] = useState<APIEnabledMethodsResponse | null>(null); // null = loading, [] = none enabled, ['totp'] = totp enabled, etc.
	const [token, setToken] = useState<string | null>(null);
	const [code, setCode] = useState(['', '', '', '', '', '']);
	const [isLoading, setIsLoading] = useState(false);
	const [isSendingCode, setIsSendingCode] = useState(false);
	const [isVerifyingCode, setIsVerifyingCode] = useState(false);
	const [totpSecrets, setTotpSecrets] = useState<APITOTPSecrets | null>(null);
	const inputRefs = useRef([]);

	useEffect(() => {
		async function fetchEnabledMethods() {
			try {
				setIsLoading(true);
				const enabledMethods = await apiClient.mfaEnabledMethods();
				setEnabledMethods(enabledMethods);
			} catch (err) {
				const apiErr = err as APIError;
				toastError(apiErr.message);
			} finally {
				setIsLoading(false);
			}
		}

		if (currentStep === STEP.DONE)
			return ;

		fetchEnabledMethods();
	}, [apiClient, currentStep]);


	async function handleSetupMethod(method: string) {
		setSelectedMethod(method);

		setIsLoading(true);
		try {

			const { token, secrets } = await apiClient.mfaSetupInit(method);
			setToken(token);

			if (method === 'TOTP')
				setTotpSecrets(secrets!);

			if (method === 'TOTP')
				setCurrentStep(STEP.SETUP_TOTP);
			else
				setCurrentStep(STEP.VERIFY_SETUP);
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.message);
		}
		setIsLoading(false);
	}

	async function handleDisableMethod(method: string) {
		// setSelectedMethod(method);

		if (!confirm(`Are you sure you want to disable ${METHODS_META[method].title}?`)) {
			return;
		}

		try {
			setIsLoading(true);
			await apiClient.mfaDisableMethod(method);
			toastSuccess(`${METHODS_META[method].title} disabled successfully`);
			setEnabledMethods((prev) => prev?.filter((m) => m !== method) || []);
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.message);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleVerifySetup() {
		try {
			const codeJoin = code.join('');
			setIsVerifyingCode(true);

			await apiClient.mfaSetupVerify(token!, codeJoin);
			toastSuccess(`${METHODS_META[selectedMethod].title} enabled successfully!`);

			setCurrentStep(STEP.DONE);
			setCode(['', '', '', '', '', '']);
			setSelectedMethod('');
			setToken(null);
			setTotpSecrets(null);
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
