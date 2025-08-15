'use client';
import React, { useEffect, useState } from 'react';
import { Fingerprint, Smartphone, Mail, ChevronRight, Check, X } from 'lucide-react';
import funnelDisplay from '@/app/fonts/FunnelDisplay';
import { useAuth } from '../../contexts/AuthContext';

const mfaMethodsUI: mfaMethodUI[] = [
	{
		id: 'totp',
		name: 'Authenticator App',
		icon: <Fingerprint  className='group-hover:text-blue-400 transition-all duration-900 h-14 w-14' />,
		description: 'Use Google Authenticator, Authy, or similar apps',
		enabled: undefined
	},
	{
		id: 'sms',
		name: 'SMS Text Message',
		icon: <Smartphone  className='group-hover:text-green-300 transition-all duration-900 h-14 w-14' />,
		description: 'Receive codes via text message',
		enabled: undefined
	},
	{
		id: 'email',
		name: 'Email Verification',
		icon: <Mail  className='group-hover:text-yellow-300 transition-all duration-900 h-14 w-14' />,
		description: 'Receive codes via email',
		enabled: undefined
	}
];

interface mfaMethodUI {
	id: string,
	name: string,
	icon: React.ReactNode,
	description: string,
	enabled?: boolean
}

// interface MethodCardProps {
// 	method: MFA_METHOD,
// 	onSelect: () => void
// }
interface MethodCardProps {
	method: mfaMethodUI,
	onSelect: () => void,
	onDisable: () => void
}

interface MethodSelectionProps {
	onSelect: (method: string) => void,
	// onDisable: () => void
}

interface APIMethodItem {
	id: number,
	method: string,
	totp_secret: string,
	user_id: number
}

function MethodCard({ method, onSelect, onDisable } : MethodCardProps) {
	return (
		<div className={`group bg-white/4 w-full rounded-3xl backdrop-blur-2xl px-5 py-6 border-1 border-white/10 flex gap-4 items-center hover:bg-white/6 ${!method.enabled ? 'cursor-pointer' : ''} transition-all duration-500`}>
			{method.icon}
			<div>
				{/* <h1 className='font-semibold text-2xl mb-1.5 flex items-center gap-4'>{method.name}{isMostSecure && <span className='text-sm px-2 py-0.5 border-1 rounded-full text-blue-400 bg-blue-100/2'>Most Secure</span>}</h1> */}
				<h1 className='font-semibold text-2xl mb-1.5 flex items-center gap-4'>{method.name}</h1>
				<p className='font-light text-white/75'>{method.description}</p>
				{/* <div className='flex items-center gap-2 text-green-400 mt-2'>
					<Check size={16} />
					<p className='text-sm'>Currently enabled</p>
				</div> */}
			</div>
			{/* {method.enabled ? <X size={30} className='ml-auto hover:text-red-400 transition-all duration-300 cursor-pointer' onClick={onDisable}/> : <ChevronRight size={32} className='ml-auto'/>} */}
			{method.enabled ? (
			<div className={`border-1 border-red-500/20 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs h-10
							bg-red-500/2 text-red-400 hover:bg-red-500/75 hover:text-white transition-all duration-500 cursor-pointer ml-auto`}
							onClick={onDisable}>
					<div className="flex items-center gap-2 justify-center cursor-pointer">
						<X size={16} className='ml-auto'/>
						<button className='cursor-pointer'>Disable</button>
					</div>
			</div>
			) : (
			<div className={`border-1 border-blue-500/30 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs h-10
							bg-blue-500/2 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-500 cursor-pointer ml-auto`}
							onClick={onSelect}>
					<div className="flex items-center gap-2 justify-center cursor-pointer">
						<Fingerprint size={16} className='ml-auto'/>
						<button className='cursor-pointer'>Setup</button>
					</div>
			</div>
			)}
		</div>
	);
}

export default function MethodSelection({ onSelect } : MethodSelectionProps) {
	const { api } = useAuth();
	const [enabledMethods, setEnabledMethods] = useState<APIMethodItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchEnabledMethods() {
			try {
				setIsLoading(true);
				const data = await api.mfaEnabledMethods();
				// const mappedBlocked = mapAPIUserItemtoUserItem(data);
				setEnabledMethods(data);
			} catch (err) {
				alert('Error fetching enabled methods');
				alert(err);
			} finally {
				setIsLoading(false);
			}
		}
		fetchEnabledMethods();
	}, []);

	const mappedMfaMethods = mfaMethodsUI.map((item) => {
		const isEnabled = enabledMethods.some(apiItem => apiItem.method == item.id);
		return {
			...item,
			enabled: isEnabled
		};
	});

	async function handleMethodDisable(method: string) {
		try {
			await api.mfaDisableMethod(method);
			alert('Disabled ' + method);
			setEnabledMethods( prev => prev.filter((item) => (item.method !== method)) );
		} catch (err) {
			alert('Could not disable ' + method);
		}
	}

	console.log('MAPPED MFA METHODS: ', mappedMfaMethods);

	return (
		<>
			<div className='flex flex-col gap-2 px-6'>
				<h1 className='font-semibold text-3xl text-center'>Two-Factor Authentication</h1>
				<p className='mb-0 text-white/85 text-center'>Add an extra layer of security to your account by choosing your preferred verification method.</p>
			</div>
			<div className='flex flex-col gap-4 justify-center items-center'>
				{mappedMfaMethods.map((method) => (
					<MethodCard 
						key={method.id}
						method={method}
						onSelect={() => {
							console.log('TRIGGERED METHOD SELECTION: ', method.id);
							onSelect(method.id);
						}}
						onDisable={() => {
							console.log('TRIGGERED METHOD DISABLE: ', method.id);
							handleMethodDisable(method.id);
						}}
					/>
				))}
			</div>
			<div className='bg-blue-500/6 px-6 py-4 rounded-2xl backdrop-blur-2xl border-1 border-white/8 text-lg text-blue-400'>
				<p><span className='font-bold'>Recommendation: </span>Authenticator apps provide the highest security and work without internet connection.</p>
			</div>
		</>
	);
}
