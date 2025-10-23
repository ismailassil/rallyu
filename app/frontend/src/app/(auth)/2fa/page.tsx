'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Overview from './components/Overview';
import VerifyCode from '../components/Verification/Two-Factor/VerifyCode';
import { toastError } from '@/app/components/CustomToast';
import AuthPageWrapper from '../components/UI/AuthPageWrapper';

enum STEP {
	OVERVIEW = 'OVERVIEW',
	VERIFY_CODE = 'VERIFY_CODE'
}

function getTwoFAChallengeSession() {
	try {
		const idRaw = sessionStorage.getItem('token');
		const methodsRaw = sessionStorage.getItem('enabledMethods');

		if (!idRaw || !methodsRaw) return null;

		const token = JSON.parse(idRaw);
		const enabledMethods = JSON.parse(methodsRaw);
		const allowed = ['TOTP', 'SMS', 'EMAIL'] as const;

		// const uuidRegex =
		// 	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		// || !uuidRegex.test(token)

		if (
			typeof token !== 'string'
			|| !Array.isArray(enabledMethods) || enabledMethods.length === 0
			|| !enabledMethods.every(m => allowed.includes(m))
		) {
			sessionStorage.removeItem('token');
			sessionStorage.removeItem('enabledMethods');
			return null;
		}

		const uniqueSet = new Set(enabledMethods);
		if (uniqueSet.size !== enabledMethods.length || uniqueSet.size === 0) {
			sessionStorage.removeItem('token');
			sessionStorage.removeItem('enabledMethods');
			return null;
		}

		return { token, enabledMethods } as { token: string, enabledMethods: string[] };
	} catch {
		sessionStorage.removeItem('token');
		sessionStorage.removeItem('enabledMethods');
		return null;
	}
}

export default function TwoFaChallengePage() {
	const router = useRouter();
	const [step, setStep] = useState<STEP>(STEP.OVERVIEW);
	const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
	const [session] = useState(() => getTwoFAChallengeSession());

	useEffect(() => {
		if (!session) {
			toastError('Please sign in again.');
			router.replace('/login');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	if (!session)
		return null;

	function renderCurrentStep() {
		switch (step) {
			case STEP.OVERVIEW:
				return (
					<Overview
						loginSessionMeta={session!}
						onSuccess={(m) => {
							setSelectedMethod(m);
							setStep(STEP.VERIFY_CODE);
						}}
						onFailure={() => router.replace('/login')}
					/>
				);
			case STEP.VERIFY_CODE:
				return (
					<VerifyCode
						selectedMethod={selectedMethod!}
						loginSessionMeta={session!}
						onSuccess={() => router.replace('/dashboard')}
						onFailure={() => router.replace('/login')}
						onGoBack={() => setStep(STEP.OVERVIEW)}
					/>
				);
			default:
				return null;
		}
	}


	return (
		<AuthPageWrapper wrapperKey="two-fa-challenge-page-wrapper">
			{renderCurrentStep()}
		</AuthPageWrapper>
	);
}
