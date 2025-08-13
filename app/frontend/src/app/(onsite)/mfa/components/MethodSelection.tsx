'use client';
import React from 'react';
import { Fingerprint, Smartphone, Mail, ChevronRight, Check, X } from 'lucide-react';
import funnelDisplay from '@/app/fonts/FunnelDisplay';

const MFA_METHODS: MFA_METHOD[] = [
	{
		id: 'auth_app',
		name: 'Authenticator App',
		icon: <Fingerprint  className='group-hover:text-blue-400 transition-all duration-900 h-14 w-14' />,
		description: 'Use Google Authenticator, Authy, or similar apps',
		enabled: true
	},
	{
		id: 'sms',
		name: 'SMS Text Message',
		icon: <Smartphone  className='group-hover:text-green-300 transition-all duration-900 h-14 w-14' />,
		description: 'Receive codes via text message',
		enabled: false
	},
	{
		id: 'email',
		name: 'Email Verification',
		icon: <Mail  className='group-hover:text-yellow-300 transition-all duration-900 h-14 w-14' />,
		description: 'Receive codes via email',
		enabled: false
	}
];

interface MFA_METHOD {
	id: string,
	name: string,
	icon: React.ReactNode,
	description: string,
	enabled: boolean
}

interface MethodCardProps {
	method: MFA_METHOD,
	onSelect: () => void
}

interface MethodSelectionProps {
	onSubmit: (method: string) => void
}

function MethodCard({ method, onSelect } : MethodCardProps) {
	// const isMostSecure = method.id === 'auth_app';

	return (
		<div className='group bg-white/4 w-full rounded-3xl backdrop-blur-2xl px-5 py-6 border-1 border-white/10 flex gap-4 items-center hover:bg-white/6 cursor-pointer transition-all duration-500'
			 onClick={onSelect}>
			{method.icon}
			<div>
				{/* <h1 className='font-semibold text-2xl mb-1.5 flex items-center gap-4'>{method.name}{isMostSecure && <span className='text-sm px-2 py-0.5 border-1 rounded-full text-blue-400 bg-blue-100/2'>Most Secure</span>}</h1> */}
				<h1 className='font-semibold text-2xl mb-1.5 flex items-center gap-4'>{method.name}<span className={`text-sm px-2 py-0.5 border-1 rounded-full ${method.enabled ? 'text-blue-400 bg-blue-100/2' : 'text-red-400 bg-red-100/2'}`}>{method.enabled ? 'Enabled' : 'Disabled'}</span></h1>
				<p className='font-light text-white/75'>{method.description}</p>
				{/* <div className='flex items-center gap-2 text-green-400 mt-2'>
					<Check size={16} />
					<p className='text-sm'>Currently enabled</p>
				</div> */}
			</div>
			{method.enabled ? <X size={30} className='ml-auto hover:text-red-400 transition-all duration-300'/> : <ChevronRight size={32} className='ml-auto'/>}
			{/* <div className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs h-10
							hover:bg-red-500 hover:text-white transition-all duration-500 cursor-pointer ml-auto`}>
					<div className="flex items-center gap-2 justify-center cursor-pointer">
						{method.enabled ? <X size={16} className='ml-auto'/> : <Check size={16} className='ml-auto'/>}
						<button className='cursor-pointer'>{method.enabled ? 'Disable' : 'Enable'}</button>
					</div>
			</div> */}
		</div>
	);
}

export default function MethodSelection({ onSubmit } : MethodSelectionProps) {
	return (
		<>
			<div className='flex flex-col gap-2 px-6'>
				<h1 className='font-semibold text-3xl text-center'>Two-Factor Authentication</h1>
				<p className='mb-0 text-white/85 text-center'>Add an extra layer of security to your account by choosing your preferred verification method.</p>
			</div>
			<div className='flex flex-col gap-4 justify-center items-center'>
				{MFA_METHODS.map((method) => (
					<MethodCard 
						key={method.id}
						method={method}
						onSelect={() => onSubmit(method.id) }
					/>
				))}
			</div>
			<div className='bg-blue-500/6 px-6 py-4 rounded-2xl backdrop-blur-2xl border-1 border-white/8 text-lg text-blue-400'>
				<p><span className='font-bold'>Recommendation: </span>Authenticator apps provide the highest security and work without internet connection.</p>
			</div>
		</>
	);
}
