import { useState } from 'react';

// type MfaMethod = 'auth_app' | 'sms' | 'email';

interface MfaSetupState {
	currentStep: number,
	selectedMethod: string | null,
	contactMethod: string
}

export default function useMfaSetup() {
	const [state, setState] = useState<MfaSetupState>({
		currentStep: 1,
		selectedMethod: null,
		contactMethod: ''
	});

	const handleMethodSelect = (method: string) => {
		setState(prev => ({
			...prev,
			selectedMethod: method,
			currentStep: prev.currentStep + 1
		}));
	};

	const handleSetupInit = (contact: string) => {
		setState(prev => ({
			...prev,
			contactMethod: contact,
			currentStep: prev.currentStep + 1
		}));
	};

	const handleVerifySetup = (code: string) => {
		if (code) {
			setState(prev => ({
				...prev,
				currentStep: prev.currentStep + 1
			}));
		}
	};

	const handleGoBack = () => {
		setState(prev => ({
			...prev,
			currentStep: prev.currentStep > 1 ? prev.currentStep - 1 : prev.currentStep
		}));
	};

	const handleReset = () => {
		setState({
			currentStep: 1,
			selectedMethod: null,
			contactMethod: ''
		});
	};

	return {
		state,
		actions: {
			handleMethodSelect,
			handleSetupInit,
			handleVerifySetup,
			handleGoBack,
			handleReset
		}
	};
}
