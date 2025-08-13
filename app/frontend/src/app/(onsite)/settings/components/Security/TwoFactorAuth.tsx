import funnelDisplay from "@/app/fonts/FunnelDisplay";
import { Fingerprint, Mail, Smartphone, XIcon } from "lucide-react";
import React from "react";

const mfaData = [
	{ method: 'totp', name: 'Authenticator App', icon: <Fingerprint  className='group-hover:text-blue-400 transition-all duration-900 h-14 w-14' />, contact: 'Google Authenticator, Authy, or similar apps', enabled: true },
	{ method: 'email', name: 'Email Verification', icon: <Smartphone  className='group-hover:text-green-300 transition-all duration-900 h-14 w-14' />, contact: 'your-email@gmail.com', enabled: true },
	{ method: 'sms', name: 'SMS Verification', icon: <Mail  className='group-hover:text-yellow-300 transition-all duration-900 h-14 w-14' />, contact: '+212636299821', enabled: false }
];

function TwoFactorAuthMethodCard({ method }) {
	return (
		<div className="flex flex-col">
			<div className='group w-full rounded-3xl backdrop-blur-2xl px-5 py-6 border-1 border-white/10 
				flex gap-4 items-center hover:bg-white/1 cursor-pointer transition-all duration-500'>
				{method.icon}
				<div>
					<h1 className='font-semibold text-2xl mb-1.5 flex items-center gap-4'>{method.name}</h1>
					<p className='font-light text-white/75'>{`Using ${method.contact}`}</p>
				</div>
				{/* <ChevronRight size={36} className='ml-auto'/> */}
				<div className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs h-10 ml-auto`}>
					<div className="flex items-center gap-2 justify-center">
						<XIcon size={16}/>
						<button>Disable</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function TwoFactorAuth() {
	return (
		<div className="flex flex-col gap-4 px-18">
			{mfaData.map((method) => (
				<TwoFactorAuthMethodCard 
					key={method.method}
					method={method}
				/>
			))}
		</div>
	);
}