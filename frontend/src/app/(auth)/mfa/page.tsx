'use client';
import React, { useState } from 'react';
import MethodSelection from './components/MethodSelection';
import SetupInit from './components/SetupInit';

export default function MFASetup() {
	const [currentStep, setCurrentStep] = useState(1);
	const [selectedMethod, setSelectedMethod] = useState(null);

	return (
		<>
			<main className="pt-30 flex h-[100vh] w-full pb-10">
				<div className="flex h-full w-full justify-center overflow-auto">
					<div className="mine flex h-full w-[650px] items-start justify-center pb-20 pl-10 pr-10 pt-20 lg:items-center">
						<div className='rounded-[0px] max-w-[550px] w-full p-9 sm:p-18
									flex flex-col gap-5'>
							{/* {currentStep === 1 && <MethodSelection />} */}
							{currentStep === 1 && <SetupInit selectedMethod='auth_app' />}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
