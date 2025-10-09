import React, { ChangeEvent, ReactNode } from 'react';
import funnelDisplay from '@/app/fonts/FunnelDisplay';
import { Upload, X } from 'lucide-react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import Avatar from '@/app/(onsite)/users/components/Avatar';
import { useFormContext } from '@/app/(auth)/components/shared/form/FormContext';

interface ProfilePreviewProps {
	avatarFile: File | null;
	avatarBlobPreview: string | null;
	onAddAvatarFile: (e: ChangeEvent<HTMLInputElement>) => void;
	onRemoveAvatarFile: () => void;
}

type ButtonProps = {
	children: ReactNode;
	actionIcon?: ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	asLabel?: boolean;
	htmlFor?: string; // only used when asLabel is true
};

function Button({ children, actionIcon, onClick, disabled = false, asLabel = false, htmlFor  } : ButtonProps) {
	const className = `flex gap-2 justify-center items-center px-5 py-1.5 rounded-full h-10 select-none
						bg-white/6 border border-white/8 transition-all duration-800 ease-in-out
						font-funnel-display font-medium
						${disabled 
						? 'opacity-0 pointer-events-none translate-y-0.5' 
						: 'opacity-100 hover:bg-white hover:text-black cursor-pointer'
					}`;
	
	if (asLabel) {
		return (
			<label htmlFor={htmlFor} className={className}>
				{actionIcon}
				{children}
			</label>
		);
	}

	return (
		<button
			onClick={onClick}
			className={className}
			disabled={disabled}
		>
			{actionIcon}
			{children}
		</button>
	);
}

export default function ProfilePreview({ avatarFile, avatarBlobPreview, onAddAvatarFile, onRemoveAvatarFile } : ProfilePreviewProps) {
	const { loggedInUser } = useAuth();

	const {
		formData
	} = useFormContext();

	return (
		<div className="bg-white/2 border border-white/8
						flex flex-col md:flex-row gap-10 items-center w-full rounded-3xl py-7 px-9 justify-between">
			<div className="flex flex-col md:flex-row items-center md:text-start text-center gap-8">
				{/* AVATAR + USER INFO */}
				<div className='relative'>
					<label htmlFor="profile-upload">
						<div className='absolute rounded-full w-full h-full flex justify-center items-center
									bg-black/60 opacity-0 hover:opacity-100 cursor-pointer
									z-1 transition-all duration-500'
						>
							<Upload size={36} />
						</div>
					</label>
					<Avatar
						avatar={avatarBlobPreview || loggedInUser!.avatar_url}
						className='h-27 w-27 ring-4 ring-white/10 relative'
					/>
				</div>
				<div>
					<h1 className="font-bold text-xl text-white/90 capitalize">
						{formData.first_name || loggedInUser!.first_name} {formData.last_name || loggedInUser!.last_name}
					</h1>
					<p className={`text-base text-white/70 ${funnelDisplay.className}`}>
						@{formData.username || loggedInUser!.username}
					</p>
					<p className={`text-base text-white/70 ${funnelDisplay.className}`}>
						{formData.email || loggedInUser!.email}
					</p>
					<p className={`text-base text-white/70 ${funnelDisplay.className}`}>
						{formData.bio || loggedInUser!.bio}
					</p>
				</div>
			</div>
			

			{/* CHANGE/REMOVE PIC BUTTON */}
			{avatarFile ? (
				<Button 
					actionIcon={<X size={16} />}
					onClick={onRemoveAvatarFile}
				>
					Remove Picture
				</Button>
			) : (
				<Button 
					actionIcon={<Upload size={16} />}
					asLabel
					htmlFor='profile-upload'
				>
					Change Picture
				</Button>
			)}
			<input
				id="profile-upload"
				type="file"
				accept="image/*"
				className="hidden"
				onChange={onAddAvatarFile}
			/>
		</div>
	);
}
