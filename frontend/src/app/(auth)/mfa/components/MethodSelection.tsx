'use client';
import React, { useState } from 'react';
import { Fingerprint, Smartphone, Mail, ChevronRight } from 'lucide-react';

const methods = [
	{
		id: 'auth_app',
		name: 'Authenticator App',
		icon: <Fingerprint  className='group-hover:text-blue-400 transition-all duration-900 h-14 w-14' />,
		description: 'Use Google Authenticator, Authy, or similar apps',
	},
	{
		id: 'sms',
		name: 'SMS Text Message',
		icon: <Smartphone  className='group-hover:text-green-300 transition-all duration-900 h-14 w-14' />,
		description: 'Receive codes via text message',
	},
	{
		id: 'email',
		name: 'Email Verification',
		icon: <Mail  className='group-hover:text-yellow-300 transition-all duration-900 h-14 w-14' />,
		description: 'Receive codes via email',
	}
];

function MethodCard({ name, icon, description, onSelect }) {
	return (
		<div className='group bg-white/4 w-full rounded-3xl backdrop-blur-2xl px-5 py-6 border-1 border-white/10 flex gap-4 items-center hover:bg-white/6 cursor-pointer transition-all duration-500'
			 onClick={onSelect}>
			{icon}
			<div>
				<h1 className='font-semibold text-2xl mb-1.5 flex items-center gap-4'>{name}{name === 'Authenticator App' && <span className='text-sm px-2 py-0.5 border-1 rounded-full text-blue-400 bg-blue-100/2'>Most Secure</span>}</h1>
				<p className='font-light text-white/75'>{description}</p>
			</div>
			<ChevronRight size={36} className='ml-auto'/>
		</div>
	);
}

export default function MethodSelection({ onSubmit }) {
	// async function handleSelect(method: string) {
	// 	// alert(`selected ${method}!`);
	// 	setSelectedMethod(method);
	// }

	return (
		<>
			<div className='flex flex-col gap-2 px-6'>
				<h1 className='font-semibold text-3xl text-center'>Enable Two-Factor Authentication</h1>
				<p className='mb-0 text-white/85 text-center'>Add an extra layer of security to your account by choosing your preferred verification method.</p>
			</div>
			<div className='flex flex-col gap-4 justify-center items-center'>
				{methods.map((method) => (
					<MethodCard 
						key={method.id} 
						name={method.name} 
						icon={method.icon} 
						description={method.description} 
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
