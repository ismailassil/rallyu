import { motion } from "framer-motion";
import Image from "next/image";
import SettingsCard from "../SettingsCard";
import { XIcon, Fingerprint, Smartphone, Mail, Check, Laptop, MapPin, Clock, Trash2, Monitor } from "lucide-react";
import funnelDisplay from "@/app/fonts/FunnelDisplay";
import MFASetup from "../../../2fa/page";
import ChangePasswordForm from "./ChangePasswordForm";
import TwoFactorAuth from "./TwoFactorAuth";
import { useRouter } from "next/navigation";

// const mfaData = [
// 	{ method: 'totp', name: 'Authenticator App', icon: <Fingerprint  className='group-hover:text-blue-400 transition-all duration-900 h-14 w-14' />, contact: 'Google Authenticator, Authy, or similar apps', enabled: true },
// 	{ method: 'email', name: 'Email Verification', icon: <Smartphone  className='group-hover:text-green-300 transition-all duration-900 h-14 w-14' />, contact: 'your-email@gmail.com', enabled: true },
// 	{ method: 'sms', name: 'SMS Verification', icon: <Mail  className='group-hover:text-yellow-300 transition-all duration-900 h-14 w-14' />, contact: '+212636299821', enabled: false }
// ];

// const sessionsData = [
// 	{ browser: 'brave', device: 'MacBook Pro', os: 'Mac OS X', createdSince: '1 day' },
// 	{ browser: 'chrome', device: 'Dell Latitude E6400', os: 'Linux', createdSince: '6 days' },
// 	{ browser: 'safari', device: 'iMac', os: 'Mac OS X', createdSince: '2 hours' },
// 	{ browser: 'chrome', device: 'iPhone 13', os: 'iOS', createdSince: '14 minutes' }
// ];

// function FormField({ label, placeholder, icon }) {
// 	return (
// 		<div className='field flex flex-col gap-0.5 box-border flex-1'>
// 			<label htmlFor='fname'>{label}</label>
// 			<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg border border-white/10'>
// 				<Image alt='First Name' src={icon} width={20} height={20}></Image>
// 				<input 
// 					id=''
// 					name='' 
// 					type='text'
// 					placeholder={placeholder}
// 					className='outline-none flex-1 overflow-hidden' 
// 					// value={inputValue}
// 					// onChange={onChange}
// 				/>
// 			</div>
// 		</div>
// 	);
// }

// function ChangePasswordForm() {
// 	return (
// 		<div className='flex px-18 gap-8'>
// 			<div className='flex flex-col gap-4 flex-2'>
// 				<FormField 
// 					label='Current Password'
// 					placeholder='••••••••••••••••'
// 					icon='/icons/lock.svg'
// 				/>
// 				<FormField 
// 					label='New Password'
// 					placeholder='••••••••••••••••'
// 					icon='/icons/lock.svg'
// 				/>
// 				<FormField 
// 					label='Confirm New Password'
// 					placeholder='••••••••••••••••'
// 					icon='/icons/lock.svg'
// 				/>
// 			</div>
// 			<div className='bg-gradient-to-br from-white/0 to-white/4 border-1 border-white/6 rounded-2xl px-8 py-6 flex-1'>
// 				<h1 className="font-bold text-xl">Rules for passwords</h1>
// 				<p className="text-sm text-white/75">To create a new password, you have to meet all of the following requirements: </p>
// 				<br></br>
// 				<p className="text-sm"> - Minimum 8 characters</p>
// 				<p className="text-sm"> - At least one lowercase</p>
// 				<p className="text-sm"> - At least one uppercase</p>
// 				<p className="text-sm"> - At least one number</p>
// 				<p className="text-sm"> - At least one special character</p>
// 				<p className="text-sm"> - Can&#39;t be the same as previous</p>
// 			</div>
// 		</div>
// 	);
// }

// function TwoFactorAuthMethodCard({ method }) {
// 	return (
// 		<div className="flex flex-col">
// 			<div className='group w-full rounded-3xl backdrop-blur-2xl px-5 py-6 border-1 border-white/10 
// 				flex gap-4 items-center hover:bg-white/1 cursor-pointer transition-all duration-500'>
// 				{method.icon}
// 				<div>
// 					<h1 className='font-semibold text-2xl mb-1.5 flex items-center gap-4'>{method.name}</h1>
// 					<p className='font-light text-white/75'>{`Using ${method.contact}`}</p>
// 				</div>
// 				{/* <ChevronRight size={36} className='ml-auto'/> */}
// 				<div className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs h-10 ml-auto`}>
// 					<div className="flex items-center gap-2 justify-center">
// 						<XIcon size={16}/>
// 						<button>Disable</button>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// function TwoFactorAuth() {
// 	return (
// 		<div className="flex flex-col gap-4 px-18">
// 			{mfaData.map((method) => (
// 				<TwoFactorAuthMethodCard 
// 					key={method.method}
// 					method={method}
// 				/>
// 			))}
// 		</div>
// 	);
// }

// const sessionsData = [
// 	{ id: 1, browser: "Brave", device: "MacBook Pro", os: "Mac OS X", createdSince: "1 day", location: "Khouribga, Morocco", type: "laptop" },
// 	{ id: 2, browser: "Chrome", device: "Dell Latitude E6400", os: "Linux", createdSince: "6 days", location: "Casablanca, Morocco", type: "laptop" },
// 	{ id: 3, browser: "Safari", device: "iMac", os: "Mac OS X", createdSince: "2 hours", location: "Rabat, Morocco", type: "desktop" },
// 	{ id: 4, browser: "Chrome", device: "iPhone 13", os: "iOS", createdSince: "14 minutes", location: "Marrakech, Morocco", type: "mobile" }
// ];

// function DeviceIcon({ type }) {
// 	if (type === "mobile") return <Smartphone className="h-12 w-12" />;
// 	if (type === "desktop") return <Monitor className="h-12 w-12" />;
// 	return <Laptop className="h-12 w-12" />;
// }

// function SessionCard({ session }) {
// 	return (
// 		<li className="bg-white/4 rounded-2xl border border-white/10 px-6 py-3 flex items-center justify-between">
// 			<div className="flex gap-3 items-center w-48 mr-24">
// 				<DeviceIcon type={session.type} />
// 				<div className="w-32">
// 					<h2 className="font-bold text-white text-lg truncate">{session.device}</h2>
// 					<p className="font-light text-sm text-white/75">{session.browser} - {session.os}</p>
// 				</div>
// 			</div>

// 			<div className="flex gap-12 items-center w-48 mr-24">
// 				<div className="flex gap-1.5 items-center">
// 					<MapPin className="h-4 w-4 text-white/75" />
// 					<p className="font-light text-sm text-white/75">{session.location}</p>
// 				</div>
// 			</div>
// 			<div className="flex gap-12 items-center w-48">
// 				<div className="flex gap-1.5 items-center">
// 					<Clock className="h-3 w-3 text-white/75" />
// 					<p className="font-light text-sm text-white/75">{session.createdSince} ago</p>
// 				</div>
// 			</div>

// 			<button
// 				className="hover:text-red-400 cursor-pointer transition-all duration-500"
// 			>
// 				<Trash2 className="h-6 w-6" />
// 			</button>
// 		</li>
// 	);
// }
  
// function Devices() {
// 	return (
// 		<ul className="flex flex-col gap-4 px-6">
// 			{sessionsData.map(session => (
// 			<SessionCard key={session.id} session={session} />
// 			))}
// 		</ul>
// 	);
// }

export default function Security() {
	const router = useRouter();

	return (
		<motion.div
			initial={{ opacity: 0, x: 5 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 1, x: -5 }}
			transition={{ duration: 0.5 }}
		>
			<div className='flex flex-col gap-4'>
				{/* <TwoFactorAuth /> */}
				<SettingsCard 
					title="Two-factor Authentication"
					subtitle="Add an extra layer of security to your account by choosing your preferred verification method"
					isAction={true}
					actionLabel='Manage 2FA'
					actionIcon={<Fingerprint size={16} />}
					onAction={() => router.push('/2fav2')}
				>
				</SettingsCard>
				<SettingsCard 
					title="Change Password"
					subtitle="Modify your current password"
					isForm={true}
					// formId='settings-change-password-form'
					formSubmitLabel='Save Changes'
				>
					<ChangePasswordForm />
				</SettingsCard>
				{/* <SettingsCard 
					title="Browsers and devices"
					subtitle="These browsers and devices are currently signed in to you account. Remove any unauthorized devices"
				>
					<Devices />
				</SettingsCard>
				<SettingsCard 
					title="Delete Account"
					subtitle="This will permanently delete your account and all associated data. This action is irreversible"
					isAction={true}
				>
					<Devices />
				</SettingsCard> */}
			</div>
		</motion.div>
	);
}
