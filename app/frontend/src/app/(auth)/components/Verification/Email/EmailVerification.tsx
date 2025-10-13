'use client';
import React, { useState } from 'react';
import VerifyEmail from './VerifyEmail';
import VerifyCode from './VerifyCode';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';

enum STEP {
	SETUP = 'SETUP',
	VERIFY = 'VERIFY',
	DONE = 'DONE'
}

interface PhoneVerificationProps {
	onReset: () => void;
	onSuccess?: () => void;
	onFailure?: () => void;
}

export default function EmailVerification({ onReset, onSuccess, onFailure } : PhoneVerificationProps) {
	const [currentStep, setCurrentStep] = useState<STEP>(STEP.SETUP);
	const [token, setToken] = useState('');

	const {
		triggerLoggedInUserRefresh
	} = useAuth();

	function renderCurrentStep() {
		switch (currentStep) {
			case STEP.SETUP:
				return (
					<VerifyEmail
						onGoBack={onReset}
						onNext={(token) => {
							setToken(token);
							setCurrentStep(STEP.VERIFY);
						}}
					/>
				);
			case STEP.VERIFY:
				return (
					<VerifyCode
						onGoBack={() => {
							setCurrentStep(STEP.SETUP);
						}}
						token={token}
						onNext={() => {
							triggerLoggedInUserRefresh();
							if (onSuccess) onSuccess();
							else setCurrentStep(STEP.DONE);
						}}
					/>
				);
		}
	}

	return (
		<>
			{renderCurrentStep()}
		</>
	);
}
