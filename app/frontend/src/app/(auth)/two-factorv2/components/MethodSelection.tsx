import { Fingerprint, Mail, Smartphone } from 'lucide-react';
import React from 'react';
import TwoFactorAuthMethodCard from './TwoFactorAuthMethodCard';
import { alertError, alertLoading, alertSuccess } from '../../components/CustomToast';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const all2FAMethods = [
	{ type: 'totp', title: 'Authenticator App', description: 'Google Authenticator, Authy, or similar apps', icon: <Fingerprint className='group-hover:text-blue-400 transition-all duration-900 h-14 w-14' /> },
	{ type: 'sms', title: 'SMS', description: 'Receive codes via SMS', icon: <Smartphone className='group-hover:text-green-300 transition-all duration-900 h-14 w-14' /> },
	{ type: 'email', title: 'Email', description: 'Receive codes via Email', icon: <Mail className='group-hover:text-yellow-300 transition-all duration-900 h-14 w-14' /> },
];

type MethodSelectionProps = {
	onSelect: (method: string) => void;
}

export default function MethodSelection({ onSelect } : MethodSelectionProps) {
	const { send2FACode } = useAuth();
	const router = useRouter();

	console.log('RENDERING METHODSELECTION');

	const loginChallengeIDrw = sessionStorage.getItem('loginChallengeID');
	const enabledMethodsrw = sessionStorage.getItem('enabledMethods');
	if (!loginChallengeIDrw || !enabledMethodsrw)
		return <div>DEV - METHODSELECTIONSTEP - Invalid login session state. Should be redirected to /login</div>;
		// router.replace('/login');

	let loginChallengeID: number;
	let enabledMethods: string[];
	try {
		loginChallengeID = JSON.parse(loginChallengeIDrw);
		enabledMethods = JSON.parse(enabledMethodsrw);
		if (typeof loginChallengeID !== 'number' || !Array.isArray(enabledMethods)) {
			throw new Error();
		}
	} catch {
		return <div>DEV - METHODSELECTIONSTEP - Corrupted login session state</div>;
	}

	// const loginChallengeID = JSON.parse(loginChallengeIDrw!);
	// const enabledMethods = JSON.parse(enabledMethodsrw!);
	console.log('MethodSelection Rendered', loginChallengeID, enabledMethods);
	// if (!loginChallengeID)
	// 	return <div>loginChallengeID is not present in sessionStorage</div>;
	// if (!enabledMethods)
	// 	return <div>enabledMethods is not present in sessionStorage</div>;

	const cardsToShow = all2FAMethods.filter(elm => enabledMethods.includes(elm.type));

	async function handleSendCode(method: string) {
		if (!loginChallengeID || !enabledMethods)
			return ;

		try {
			alertLoading('Sending code...');
			await send2FACode(loginChallengeID, method);
			alertSuccess('Code sent!');
			onSelect(method);
		} catch {
			alertError('Something Went Wrong!');
		}
	}

	return (
		<div>
			{cardsToShow.map(elm => {
				return (
					<TwoFactorAuthMethodCard 
						key={elm.type}
						title={elm.title}
						icon={elm.icon}
						description={elm.description}
						onClick={() => handleSendCode(elm.type)}
					/>
				);
			})}
		</div>
	);
}
