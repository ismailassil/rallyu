import { Fingerprint, Mail, Smartphone } from 'lucide-react';
import React from 'react';
import TwoFactorAuthMethodCard from './TwoFactorAuthMethodCard';

const METHODS_META: Record<string, { title: string; description: string, icon: React.JSX.Element }> = {
	totp: { title: 'Authenticator App', description: 'Google Authenticator, Authy, or similar apps', icon: <Fingerprint className='group-hover:text-blue-400 transition-all duration-900 h-14 w-14' /> },
	sms: { title: 'SMS', description: 'Receive codes via SMS', icon: <Smartphone className='group-hover:text-green-300 transition-all duration-900 h-14 w-14' /> },
	email: { title: 'Email', description: 'Receive codes via Email', icon: <Mail className='group-hover:text-yellow-300 transition-all duration-900 h-14 w-14' /> }
};

interface MethodSelectionProps {
	session: { loginChallengeID: number; enabledMethods: string[] };
	onSelect: (method: string) => void;
}

export default function MethodSelection({ session, onSelect } : MethodSelectionProps) {
	console.log('RENDERING METHODSELECTION');

	const cardsToShow = session.enabledMethods.filter(m => Object.keys(METHODS_META).includes(m));

	return (
		<div>
			{cardsToShow.map(m => {
				return (
					<TwoFactorAuthMethodCard 
						key={m}
						title={METHODS_META[m].title}
						icon={METHODS_META[m].icon}
						description={METHODS_META[m].description}
						onClick={() => onSelect(m)}
					/>
				);
			})}
		</div>
	);
}
