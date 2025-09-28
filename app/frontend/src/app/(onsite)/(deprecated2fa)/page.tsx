'use client';
import React from 'react';
import MethodSelection from './components/MethodSelection';
import SetupInit from './components/SetupInit';
import VerifySetup from './components/VerifySetup';
import SetupComplete from './components/SetupComplete';
import useMfaSetup from './hooks/useMfaSetup';

export default function MFASetup() {
	const { state, actions } = useMfaSetup();
	const { currentStep, selectedMethod, contactMethod } = state;

	function renderCurrentStep() {
		switch (currentStep) {
			case 1:
				return (
					<MethodSelection 
						onSelect={actions.handleMethodSelect} 
					/>
				);
			case 2:
				return (
					<SetupInit 
						selectedMethod={selectedMethod!} 
						onSubmit={actions.handleSetupInit}
						onGoBack={actions.handleGoBack} 
					/>
				);
			case 3:
				return (
					<VerifySetup 
						selectedMethod={selectedMethod!} 
						contactMethod={contactMethod}
						onSubmit={actions.handleVerifySetup}
						onGoBack={actions.handleGoBack} 
					/>
				);
			case 4:
				return (
					<SetupComplete />
				);
		}
	}

	return (
		<>
			<main className="pt-30 flex h-[100vh] w-full pb-10">
				<div className="flex h-full w-full justify-center overflow-auto">
					<div className="mine flex h-full w-[1000px] items-start justify-center pb-20 pl-10 pr-10 pt-20 lg:items-center">
						<div className='rounded-[0px] max-w-[750px] w-full p-9 sm:p-18
									flex flex-col gap-8'>
							{ renderCurrentStep() }
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
