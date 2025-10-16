import { Fingerprint, Smartphone, Mail } from 'lucide-react';

export const METHODS_META: Record<string, { title: string; description: string, icon: React.JSX.Element }> = {
	TOTP: {
		title: 'Authenticator App',
		description: 'Using Google Authenticator, Authy...',
		icon: <Fingerprint size={54} className='group-hover:text-blue-400 transition-all duration-900' />
	},
	EMAIL: {
		title: 'Email',
		description: 'Receive codes via Email',
		icon: <Mail size={54}  className='group-hover:text-yellow-300 transition-all duration-900' />
	},
	SMS: {
		title: 'SMS',
		description: 'Receive codes via SMS',
		icon: <Smartphone size={54}  className='group-hover:text-green-300 transition-all duration-900' />
	}
};
