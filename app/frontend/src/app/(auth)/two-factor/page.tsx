'use client';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import MethodsOverview from './components/MethodsOverview';
import VerifyCode from './components/VerifyCode';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { simulateBackendCall } from '@/app/(api)/utils';
import { APIError } from '@/app/(api)/APIClient';
import { toastError, toastSuccess } from '@/app/components/CustomToast';

enum STEP {
	OVERVIEW = 'OVERVIEW',
	VERIFY_CODE = 'VERIFY_CODE'
}

function getTwoFAChallengeSession() {
	try {
		const idRaw = sessionStorage.getItem('loginChallengeID');
		const methodsRaw = sessionStorage.getItem('enabledMethods');
		console.log('SESSION RAW: ', idRaw, methodsRaw);
	
		if (!idRaw || !methodsRaw) return null;

		const loginChallengeID = JSON.parse(idRaw);
		const enabledMethods = JSON.parse(methodsRaw);
		const allowed = ['TOTP', 'SMS', 'EMAIL'] as const;

		if (
			typeof loginChallengeID !== 'number' || !Number.isInteger(loginChallengeID) || loginChallengeID <= 0
			|| !Array.isArray(enabledMethods) || enabledMethods.length === 0 || !enabledMethods.every(m => allowed.includes(m))
		) {
			sessionStorage.removeItem('loginChallengeID');
			sessionStorage.removeItem('enabledMethods');
			return null;
		}

		const uniqueSet = new Set(enabledMethods);
		if (uniqueSet.size !== enabledMethods.length || uniqueSet.size === 0) {
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

export default function TwoFaChallengePage() {
	const router = useRouter();
	const { send2FACode, verify2FACode } = useAuth();
	const [currentStep, setCurrentStep] = useState<STEP>(STEP.OVERVIEW);
	const [selectedMethod, setSelectedMethod] = useState('');
	const [code, setCode] = useState(['', '', '', '', '', '']);
	const [isSendingCode, setIsSendingCode] = useState(false);
	const [isVerifyingCode, setIsVerifyingCode] = useState(false);
	const inputRefs = useRef([]);

	const session = getTwoFAChallengeSession();
	useEffect(() => {
		if (!session) {
			toastError('Please sign in again.');
			router.replace('/login');
		}
	}, [session, router]);
	if (!session)
		return null;

	async function handleSelectMethod(method: string) {
		try {
			setSelectedMethod(method);
			setIsSendingCode(true);

			await simulateBackendCall(2000);
			await send2FACode(session!.loginChallengeID, method);

			if (method !== 'TOTP')
				toastSuccess('Code sent');

			setCurrentStep(STEP.VERIFY_CODE);
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.message);

			if (apiErr.code !== 'AUTH_2FA_CHALLENGE_INVALID_CODE')
				router.replace('/login');
		} finally {
			setIsSendingCode(false);
		}
	}

	async function handleVerifyCode() {
		try {
			setIsVerifyingCode(true);

			await simulateBackendCall(2000);
			await verify2FACode(session!.loginChallengeID, selectedMethod, code.join(''));

			toastSuccess('Two Factor Authentication successful');

			router.replace('/dashboard');
		} catch (err) {
			const apiErr = err as APIError;
			toastError(apiErr.message);
			setCode(['', '', '', '', '', '']);

			if (apiErr.code !== 'AUTH_2FA_CHALLENGE_INVALID_CODE')
				router.replace('/login');
		} finally {
			setIsVerifyingCode(false);
		}
	}

	function renderCurrentStep() {
		switch (currentStep) {
			case STEP.OVERVIEW:
				return (
					<MethodsOverview
						methods={session!.enabledMethods}
						selectedMethod={selectedMethod}
						isSendingCode={isSendingCode}
						onSelectMethod={handleSelectMethod}
					/>
				);
			case STEP.VERIFY_CODE:
				return (
					<VerifyCode 
						methods={session!.enabledMethods}
						selectedMethod={selectedMethod}
						code={code}
						setCode={setCode}
						inputRefs={inputRefs}
						isResendingCode={isSendingCode}
						isVerifyingCode={isVerifyingCode}
						onVerifyClick={handleVerifyCode}
						onResendClick={handleSelectMethod}
						onGoBack={() => setCurrentStep(STEP.OVERVIEW)}
					/>
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
			<div className="h-full w-full custom-scrollbar font-funnel-display">
				<div className="h-full w-full flex justify-center items-center overflow-auto px-4 py-16">
					{renderCurrentStep()}
				</div>
			</div>
			</motion.main>
		</>
	);
}
