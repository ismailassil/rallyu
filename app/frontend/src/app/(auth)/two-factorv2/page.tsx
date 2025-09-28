'use client';
import { useEffect, useState } from "react";
import MethodSelection from "./components/MethodSelection";
import VerifyCode from "./components/VerifyCode";
import { useRouter } from "next/navigation";

function getLoginChallengeSession() {
	try {
		const idRaw = sessionStorage.getItem('loginChallengeID');
		const methodsRaw = sessionStorage.getItem('enabledMethods');
		console.log('SESSION RAW: ', idRaw, methodsRaw);
	
		if (!idRaw || !methodsRaw) return null;

		const loginChallengeID = JSON.parse(idRaw);
		const enabledMethods = JSON.parse(methodsRaw);

		if (typeof loginChallengeID !== 'number' || !Array.isArray(enabledMethods)) {
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

export default function Login2FAChallengePage() {
	const router = useRouter();
	const [step, setStep] = useState<'enabled-methods' | 'submit-code'>('enabled-methods');
	const [selectedMethod, setSelectedMethod] = useState('');

	const session = getLoginChallengeSession();

	useEffect(() => {
		if (!session) {
			console.log('LOGIN SESSION DETAILS NOT FOUND');
			router.replace('/login');
		}
	}, [session, router]);

	console.log('RENDERING LOGIN2FACHALLENGE');

	if (!session) return null;

	function handleMethodSelect(method: string) {
		setSelectedMethod(method);
		setStep('submit-code');
	}

	return (
		<>
			<main className="pt-30 flex h-[100vh] w-full pb-10">
				<div className="flex h-full w-full justify-center overflow-auto">
					<div className="mine flex h-full w-[650px] items-start justify-center pb-20 pl-10 pr-10 pt-20 lg:items-center">
						<div className='rounded-[0px] max-w-[550px] w-full p-9 sm:p-18
									flex flex-col gap-5'>
							{step === 'enabled-methods' && <MethodSelection session={session} onSelect={handleMethodSelect} />}
							{step === 'submit-code' && <VerifyCode session={session} selectedMethod={selectedMethod} />}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
