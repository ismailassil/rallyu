import { motion } from "framer-motion";
import Image from "next/image";
import SettingsCard from "./SettingsCard";
import { ChevronRight, Fingerprint, Smartphone, Mail } from "lucide-react";

const mfaData = [
	{ method: 'totp', name: 'Authenticator App', contact: 'Google Authenticator, Authy, or similar apps', enabled: true },
	{ method: 'email', name: 'Email Verification', contact: 'your-email@gmail.com', enabled: true },
	{ method: 'sms', name: 'SMS Verification', contact: '+212636299821', enabled: false }
];

function FormField({ label, placeholder, icon }) {
	return (
		<div className='field flex flex-col gap-0.5 box-border flex-1'>
			<label htmlFor='fname'>{label}</label>
			<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg border border-white/10'>
				<Image alt='First Name' src={icon} width={20} height={20}></Image>
				<input 
					id=''
					name='' 
					type='text'
					placeholder={placeholder}
					className='outline-none flex-1 overflow-hidden' 
					// value={inputValue}
					// onChange={onChange}
				/>
			</div>
		</div>
	);
}

function ChangePasswordForm() {
	return (
		<div className='flex px-18 gap-8'>
			<div className='flex flex-col gap-4 flex-2'>
				<FormField 
					label='Current Password'
					placeholder='••••••••••••••••'
					icon='/icons/lock.svg'
				/>
				<FormField 
					label='New Password'
					placeholder='••••••••••••••••'
					icon='/icons/lock.svg'
				/>
				<FormField 
					label='Confirm New Password'
					placeholder='••••••••••••••••'
					icon='/icons/lock.svg'
				/>
			</div>
			<div className='bg-gradient-to-br from-white/0 to-white/4 border-1 border-white/6 rounded-2xl px-8 py-6 flex-1'>
				<h1 className="font-bold text-xl">Rules for passwords</h1>
				<p className="text-sm text-white/75">To create a new password, you have to meet all of the following requirements: </p>
				<br></br>
				<p className="text-sm"> - Minimum 8 characters</p>
				<p className="text-sm"> - At least one lowercase</p>
				<p className="text-sm"> - At least one uppercase</p>
				<p className="text-sm"> - At least one number</p>
				<p className="text-sm"> - At least one special character</p>
				<p className="text-sm"> - Can&#39;t be the same as previous</p>
			</div>
		</div>
	);
}

function TwoFactorAuthMethodCard() {
	return (
		<div className="flex flex-col px-18">
			<div className='group w-full rounded-3xl backdrop-blur-2xl px-5 py-6 border-1 border-white/10 
				flex gap-4 items-center hover:bg-white/1 cursor-pointer transition-all duration-500'>
				<Fingerprint className="h-14 w-14"/>
				<div>
					<h1 className='font-semibold text-2xl mb-1.5 flex items-center gap-4'>Authenticator App</h1>
					<p className='font-light text-white/75'>Use Google Authenticator, Authy, or similar apps</p>
				</div>
				<ChevronRight size={36} className='ml-auto'/>
			</div>
		</div>
	);
}

function TwoFactorAuth() {
	return (
		<div className="flex flex-col px-18">
			<div className='group w-full rounded-3xl backdrop-blur-2xl px-5 py-6 border-1 border-white/10 
				flex gap-4 items-center hover:bg-white/1 cursor-pointer transition-all duration-500'>
				<Fingerprint className="h-14 w-14"/>
				<div>
					<h1 className='font-semibold text-2xl mb-1.5 flex items-center gap-4'>Authenticator App</h1>
					<p className='font-light text-white/75'>Use Google Authenticator, Authy, or similar apps</p>
				</div>
				<ChevronRight size={36} className='ml-auto'/>
			</div>
		</div>
	);
}

export default function Security() {
	return (
		<motion.div
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.3, delay: 0 }}
		>
			<div className='flex flex-col gap-4'>
				<SettingsCard 
					title="Change Password"
					subtitle="Modify your current password"
					saveChanges={true}
				>
					<ChangePasswordForm />
				</SettingsCard>
				<SettingsCard 
					title="Two-factor Authentication"
					subtitle="Add an extra layer of security to your account by choosing your preferred verification method"
					saveChanges={true}
				>
					<TwoFactorAuth />
				</SettingsCard>
			</div>
		</motion.div>
	);
}
