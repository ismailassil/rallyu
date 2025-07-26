import React from 'react';
import Image from 'next/image';
import SettingsCard from './SettingsCard';
import funnelDisplay from '@/app/fonts/FunnelDisplay';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';

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

function PersonalInformationsForm() {
	return (
		<div className='flex flex-col gap-8 px-18'>
			<div className='flex gap-8 items-center bg-gradient-to-br from-white/0 to-white/8 border-1 border-white/10 w-full rounded-2xl py-6 px-6'>
				<div className="rounded-full h-27 w-27 ring-4 ring-white/10">
					<Image
						src='/profile/image.png'
						alt="Profile Image"
						width={96}
						height={96}
						className="h-full w-full object-cover rounded-full"
						quality={100}
					/>
				</div>
				<div>
					<h1 className={`font-bold text-xl text-white/90`}>Nabil Azouz</h1>
					<p className={`text-base text-white/70 ${funnelDisplay.className}`}>@xezzuz</p>
					<div className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs h-10 mt-4`}>
						<div className="flex items-center gap-2 justify-center">
							<Upload size={16}/>
							<button>Change Picture</button>
						</div>
					</div>
				</div>
			</div>

			<div className='flex flex-col gap-4'>
				<FormField 
					label='First Name'
					placeholder='Nabil'
					icon='/icons/firstname.svg'
				/>
				<FormField 
					label='Last Name'
					placeholder='Azouz'
					icon='/icons/lastname.svg'
				/>
				<FormField 
					label='Email'
					placeholder='nabil.azouz@gmail.com'
					icon='/icons/mail.svg'
				/>
				<FormField 
					label='Username'
					placeholder='xezzuz'
					icon='/icons/at.svg'
				/>
				<FormField 
					label='Bio'
					placeholder='Something went wrong, please try again later'
					icon='/icons/firstname.svg'
				/>
			</div>

		</div>
	);
}

export default function General() {
	return (
		<motion.div
			initial={{ opacity: 0, x: -50 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.3, delay: 0 }}
		>
			<div className='flex flex-col gap-4'>
				<SettingsCard 
					title="Personal Informations"
					subtitle="Update your account profile information and email address"
					saveChanges={true}
				>
					<PersonalInformationsForm />
				</SettingsCard>

				<SettingsCard 
					title="Preferences"
					subtitle="Update your preferences and customize your experience"
				>
					{/* <PersonalInformationsFormV2 /> */}
					<div className="flex flex-col gap-5 px-18 mt-8 mb-4">
						<h1>Language</h1>
						<h1>Notifications</h1>
					</div>
				</SettingsCard>
			</div>
		</motion.div>
	);
}
