import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import SettingsCard from './SettingsCards';
import funnelDisplay from '@/app/fonts/FunnelDisplay';
import { Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface FormFieldProps {
	field: keyof FormDataState;
	label: string;
	placeholder: string;
	iconSrc: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function FormField({ field, label, placeholder, iconSrc, value, onChange }: FormFieldProps) {
	return (
		<div className='field flex flex-col gap-0.5 box-border flex-1'>
			<label htmlFor={field}>{label}</label>
			<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg border border-white/10'>
				<Image alt={label} src={iconSrc} width={20} height={20} />
				<input
					id={field}
					name={field}
					type='text'
					placeholder={placeholder}
					className='outline-none flex-1 overflow-hidden'
					value={value}
					onChange={onChange}
				/>
			</div>
		</div>
	);
}

interface FormDataState {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	bio: string;
	avatar_path: string;
}

const mockUser: FormDataState = {
	first_name: 'Nabil',
	last_name: 'Azouz',
	username: 'xezzuz',
	email: 'nabil.azouz@gmail.com',
	bio: 'Something went wrong, please try again later',
	avatar_path: '/avatars/xezzuz.png'
};

function ProfilePreview({ values, file, preview, onAdd, onRemove }) {

	return (
		<div className='flex items-center bg-gradient-to-br from-white/0 to-white/8 border-1 border-white/10 w-full rounded-3xl py-6 px-8 justify-between'>
			<div className='flex gap-8'>
				<div className="rounded-full h-27 w-27 ring-4 ring-white/10 relative">
					<Image
						src={preview || `http://localhost:4025/api/users${mockUser.avatar_path}` || '/profile/image.png'}
						alt="Profile Image"
						fill
						// width={96}
						// height={96}
						className="h-full w-full object-cover rounded-full"
						quality={100}
						// unoptimized
					/>
					<input
						id="profile-upload"
						type="file"
						accept="image/*"
						className="hidden"
						onChange={onAdd}
					/>
				</div>
				<div>
					<h1 className={`font-bold text-xl text-white/90 capitalize`}>
						{values.first_name || mockUser.first_name} { values.last_name || mockUser.last_name}
					</h1>
					<p className={`text-base text-white/70 ${funnelDisplay.className}`}>
						@{values.username || mockUser.username}
					</p>
					<p className={`text-base text-white/70 ${funnelDisplay.className}`}>
						{values.email || mockUser.email}
					</p>
					<p className={`text-base text-white/70 ${funnelDisplay.className}`}>
						{values.bio || mockUser.bio}
					</p>
				</div>
			</div>
			<div className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs h-10`}>
				<div className="flex items-center gap-2 justify-center">
				{file ? (
					<>
						<X size={16} />
						<button
							onClick={onRemove}
							className="cursor-pointer text-white/80"
						>
							Remove Picture
						</button>
					</>
					) : (
					<>
						<Upload size={16} />
						<label
							htmlFor="profile-upload"
							className="cursor-pointer text-white/80"
						>
							Change Picture
						</label>
					</>
				)}
				</div>
			</div>
		</div>
	);
}

function PersonalInformationsForm({ values, onChange }) {
	return (
		<div className='flex flex-col gap-4'>
				<FormField
					label='First Name'
					field='first_name'
					iconSrc='/icons/firstname.svg'
					placeholder={mockUser.first_name}
					value={values.first_name}
					onChange={onChange}
				/>
				<FormField
					label='Last Name'
					field='last_name'
					iconSrc='/icons/lastname.svg'
					placeholder={mockUser.last_name}
					value={values.last_name}
					onChange={onChange}
				/>
				<FormField
					label='Email'
					field='email'
					iconSrc='/icons/mail.svg'
					placeholder={mockUser.email}
					value={values.email}
					onChange={onChange}
				/>
				<FormField
					label='Username'
					field='username'
					iconSrc='/icons/at.svg'
					placeholder={mockUser.username}
					value={values.username}
					onChange={onChange}
				/>
				<FormField
					label='Bio'
					field='bio'
					iconSrc='/icons/firstname.svg'
					placeholder={mockUser.bio}
					value={values.bio}
					onChange={onChange}
				/>
		</div>
	);
}

export default function General() {
	const { api } = useAuth();

	const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
	const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		username: '',
		email: '',
		bio: ''
	});

	function handleProfilePictureFileChange(e: ChangeEvent<HTMLInputElement>) {
		console.log('pic change');
		const selectedFile = e.target.files?.[0];
		if (!selectedFile)
			return ;
		setProfilePicturePreview(URL.createObjectURL(selectedFile));
		setProfilePictureFile(selectedFile);
	}
	
	function handleProfilePictureRemove() {
		console.log('pic remove');
		const fileInput = document.getElementById('profile-upload') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
		setProfilePictureFile(null);
		setProfilePicturePreview(null);
	}
	
	function handleFormChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	}
	
	async function handleProfilePictureSubmit() {
		console.log('pic submit');
		if (!profilePictureFile)
			return ;
	
		const formData = new FormData();
		formData.append('file', profilePictureFile);

		await api.uploadUserAvatar(formData);
	
		setProfilePictureFile(null); // clear file after upload
	}

	async function handleFormSubmit() {
		console.log('submitting personal info form');
		console.log('state values: ', formData);

		const payload = {};

		Object.keys(formData).forEach((key) => {
			if (formData[key] != '')
				payload[key] = formData[key];
		});

		console.log('payload to be submitted: ', payload);
	}

	async function handleSubmit() {
		await handleFormSubmit();
		await handleProfilePictureSubmit();
	}

	return (
		<motion.div
			initial={{ opacity: 0, x: 25 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.3, delay: 0 }}
		>
			<div className='flex flex-col gap-4'>
				<SettingsCard
					title="Personal Informations"
					subtitle="Update your account profile information and email address"
					onSubmit={handleSubmit}
					isForm={true}
				>
					<div className='flex flex-col gap-8 px-18'>
						<ProfilePreview 
							values={formData}
							file={profilePictureFile}
							preview={profilePicturePreview}
							onAdd={handleProfilePictureFileChange}
							onRemove={handleProfilePictureRemove}
						/>
						<PersonalInformationsForm 
							values={formData}
							onChange={handleFormChange}
						/>
					</div>
				</SettingsCard>

				{/* <SettingsCard
					title="Preferences"
					subtitle="Update your preferences and customize your experience"
				/> */}
			</div>
		</motion.div>
	);
}



















// import React, { useState } from 'react';
// import Image from 'next/image';
// import SettingsCard from './SettingsCards';
// import funnelDisplay from '@/app/fonts/FunnelDisplay';
// import { Upload } from 'lucide-react';
// import { motion } from 'framer-motion';



// function FormField({ field, label, placeholder, iconSrc, value, onChange }) {
// 	return (
// 		<div className='field flex flex-col gap-0.5 box-border flex-1'>
// 			<label htmlFor={field}>{label}</label>
// 			<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg border border-white/10'>
// 				<Image alt={label} src={iconSrc} width={20} height={20}></Image>
// 				<input 
// 					id={field}
// 					name={field}
// 					type='text'
// 					placeholder={placeholder}
// 					className='outline-none flex-1 overflow-hidden' 
// 					value={value}
// 					onChange={onChange}
// 				/>
// 			</div>
// 		</div>
// 	);
// }

// const mockUser = {
// 	first_name: 'Nabil',
// 	last_name: 'Azouz',
// 	username: 'xezzuz',
// 	email: 'nabil.azouz@gmail.com',
// 	bio: 'Something went wrong, please try again later'
// };

// function PersonalInformationsForm() {
// 	const [formData, setFormData] = useState({
// 		first_name: '',
// 		last_name: '',
// 		username: '',
// 		email: '',
// 		bio: ''
// 	});

// 	function handleChange() {

// 	}

// 	return (
// 		<div className='flex flex-col gap-8 px-18'>
// 			<div className='flex gap-8 items-center bg-gradient-to-br from-white/0 to-white/8 border-1 border-white/10 w-full rounded-2xl py-6 px-6'>
// 				<div className="rounded-full h-27 w-27 ring-4 ring-white/10">
// 					<Image
// 						src='/profile/image.png'
// 						alt="Profile Image"
// 						width={96}
// 						height={96}
// 						className="h-full w-full object-cover rounded-full"
// 						quality={100}
// 					/>
// 				</div>
// 				<div>
// 					<h1 className={`font-bold text-xl text-white/90`}>Nabil Azouz</h1>
// 					<p className={`text-base text-white/70 ${funnelDisplay.className}`}>@xezzuz</p>
// 					<div className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs h-10 mt-4`}>
// 						<div className="flex items-center gap-2 justify-center">
// 							<Upload size={16}/>
// 							<button>Change Picture</button>
// 						</div>
// 					</div>
// 				</div>
// 			</div>

// 			<div className='flex flex-col gap-4'>
// 				<FormField 
// 					label='First Name'
// 					field='fname'
// 					iconSrc='/icons/firstname.svg'
// 					placeholder={mockUser.first_name}
// 					value={formData.first_name}
// 					onChange={handleChange}
// 				/>
// 				<FormField 
// 					label='Last Name'
// 					placeholder='Azouz'
// 					icon='/icons/lastname.svg'
// 				/>
// 				<FormField 
// 					label='Email'
// 					placeholder='nabil.azouz@gmail.com'
// 					icon='/icons/mail.svg'
// 				/>
// 				<FormField 
// 					label='Username'
// 					placeholder='xezzuz'
// 					icon='/icons/at.svg'
// 				/>
// 				<FormField 
// 					label='Bio'
// 					placeholder='Something went wrong, please try again later'
// 					icon='/icons/firstname.svg'
// 				/>
// 			</div>

// 		</div>
// 	);
// }

// export default function General() {
// 	return (
// 		<motion.div
// 			initial={{ opacity: 0, x: 25 }}
// 			animate={{ opacity: 1, x: 0 }}
// 			transition={{ duration: 0.3, delay: 0 }}
// 		>
// 			<div className='flex flex-col gap-4'>
// 				<SettingsCard 
// 					title="Personal Informations"
// 					subtitle="Update your account profile information and email address"
// 					isForm={true}
// 				>
// 					<PersonalInformationsForm />
// 				</SettingsCard>

// 				<SettingsCard 
// 					title="Preferences"
// 					subtitle="Update your preferences and customize your experience"
// 				>
// 					{/* <div className="flex flex-col gap-5 px-18 mt-8 mb-4">
// 						<h1>Language</h1>
// 						<h1>Notifications</h1>
// 					</div> */}
// 				</SettingsCard>
// 			</div>
// 		</motion.div>
// 	);
// }
