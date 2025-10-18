'use client';
import React, { useState } from 'react';
import VerifyPhone from './VerifyPhone';
import VerifyCode from './VerifyCode';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';

enum STEP {
	SETUP = 'SETUP',
	VERIFY = 'VERIFY',
	DONE = 'DONE'
}

interface PhoneVerificationProps {
	onGoBack: () => void;
	onSuccess?: () => void;
	onFailure?: () => void;
}

export default function PhoneVerification({ onGoBack, onSuccess, onFailure } : PhoneVerificationProps) {
	const [currentStep, setCurrentStep] = useState<STEP>(STEP.SETUP);
	const [token, setToken] = useState('');

	const {
		triggerLoggedInUserRefresh
	} = useAuth();

	function renderCurrentStep() {
		switch (currentStep) {
			case STEP.SETUP:
				return (
					<VerifyPhone
						onGoBack={onGoBack}
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
						onSuccess={() => {
							triggerLoggedInUserRefresh();
							if (onSuccess) onSuccess();
							else setCurrentStep(STEP.DONE);
						}}
						onFailure={() => {
							triggerLoggedInUserRefresh();
							if (onFailure) onFailure();
							else {
								setToken('');
								setCurrentStep(STEP.SETUP);
							}
						}}
					/>
				);
		}
	}

	return (
		<>
			<div className="h-full w-full flex justify-center items-center overflow-auto px-4 py-16">
				{renderCurrentStep()}
			</div>
		</>
	);
}
