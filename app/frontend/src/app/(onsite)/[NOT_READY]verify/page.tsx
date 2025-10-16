'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainCardWrapper from '../components/UI/MainCardWrapper';
import VerifyPhone from './VerifyPhone';
import VerifyCode from './VerifyCode';

enum STEP {
	STEUP = 'SETUP',
	VERIFY = 'VERIFY',
	DONE = 'DONE'
}

export default function VerifyPage() {
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
