'use client';
import React, { useState } from 'react';
import MethodSelection from './components/MethodSelection';
import SetupInit from './components/SetupInit';
import VerifySetup from './components/VerifySetup';
import SetupComplete from './components/SetupComplete';

export default function MFASetup() {
	const [currentStep, setCurrentStep] = useState(1);
	const [selectedMethod, setSelectedMethod] = useState('');
	const [contactMethod, setContactMethod] = useState('');
	// const [phoneNumber, setPhoneNumber] = useState(null);

	function handleMethodSelect(method: string) {
		// validation...
		setSelectedMethod(method);
		setCurrentStep(prev => prev + 1);
	}

	function handleSetupInit(contact: string) {
		console.log(contact);
		if (contact) {
			alert(`code was sent to ${contact}`);
			setContactMethod(contact);
		}
		setCurrentStep(prev => prev + 1);
	}

	function handleVerifySetup(code: string) {
		console.log(code);
		alert(`code was submitted ${code}`);
		setCurrentStep(prev => prev + 1);
	}

	function handleGoBack() {
		setCurrentStep(prev => prev - 1);
	}

	return (
		<>
			<main className="pt-30 flex h-[100vh] w-full pb-10">
				<div className="flex h-full w-full justify-center overflow-auto">
					<div className="mine flex h-full w-[1000px] items-start justify-center pb-20 pl-10 pr-10 pt-20 lg:items-center">
						<div className='rounded-[0px] max-w-[750px] w-full p-9 sm:p-18
									flex flex-col gap-8'>
							{currentStep === 1 && <MethodSelection 
													onSubmit={handleMethodSelect} 
												  />}
							{currentStep === 2 && <SetupInit 
													selectedMethod={selectedMethod} 
													onSubmit={handleSetupInit}
													goBack={handleGoBack} 
												  />}
							{currentStep === 3 && <VerifySetup 
													selectedMethod={selectedMethod} 
													onSubmit={handleVerifySetup}
													goBack={handleGoBack} 
												  />}
							{currentStep === 4 && <SetupComplete />
							}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
