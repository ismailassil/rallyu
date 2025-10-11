import { Fingerprint, Smartphone, Mail } from 'lucide-react';

export const METHODS_META: Record<string, { title: string; description: string, icon: React.JSX.Element }> = {
	TOTP: {
		title: 'Authenticator App',
		description: 'Using Google Authenticator, Authy...', 
		icon: <Fingerprint size={54} className='group-hover:text-blue-400 transition-all duration-900' />
	},
	SMS: {
		title: 'SMS',
		description: 'Receive codes via SMS',
		icon: <Smartphone size={54}  className='group-hover:text-green-300 transition-all duration-900' />
	},
	EMAIL: {
		title: 'Email',
		description: 'Receive codes via Email',
		icon: <Mail size={54}  className='group-hover:text-yellow-300 transition-all duration-900' />
	}
};

export const METHODS_HELP: Record<string, string> = {
	TOTP: 'Enter the 6-digit code from your authenticator app',
	SMS: `We've sent a 6-digit code via SMS`,
	EMAIL: `We've sent a 6-digit code to your Email`,
};

export const METHODS_HELP2: Record<string, string> = {
	TOTP: 'Cannot access your Authenticator App?',
	SMS: `Cannot access your Phone?`,
	EMAIL: `Cannot access your Email?`,
};
