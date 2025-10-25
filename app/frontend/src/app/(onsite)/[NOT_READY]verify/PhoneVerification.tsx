'use client';
import React, { useState } from 'react';
import VerifyPhone from './VerifyPhone';
import VerifyCode from './VerifyCode';

enum STEP {
	STEUP = 'SETUP',
	VERIFY = 'VERIFY',
	DONE = 'DONE'
}

export default function PhoneVerification() {
	const [currentStep, setCurrentStep] = useState<STEP>(STEP.STEUP);
	const [token, setToken] = useState('');

	function renderCurrentStep() {
		switch (currentStep) {
			case STEP.STEUP:
				return (
					<VerifyPhone
						onGoBack={() => true}
						onNext={(token) => {
							setToken(token);
							setCurrentStep(STEP.VERIFY);
						}}
					/>
				);
			case STEP.VERIFY:
				return (
					<VerifyCode
						onGoBack={() => true}
						token={token}
						onNext={() => true}
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
