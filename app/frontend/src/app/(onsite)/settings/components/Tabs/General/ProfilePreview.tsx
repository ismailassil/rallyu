import React, { ChangeEvent, RefObject, useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Upload, X } from 'lucide-react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import Avatar from '@/app/(onsite)/users/components/Avatar';
import { useFormContext } from '@/app/(auth)/components/Form/FormContext';
import { useTranslations } from 'next-intl';
import useAPICall from '@/app/hooks/useAPICall';
import { toastError } from '@/app/components/CustomToast';

interface ProfilePreviewProps {
	ref: RefObject<any>;
	onChange: (hasUnsavedChanges: boolean) => void;
}

type ButtonProps = {
	children: React.ReactNode;
	actionIcon?: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	asLabel?: boolean;
	htmlFor?: string;
};

function Button({ children, actionIcon, onClick, disabled = false } : ButtonProps) {
	const className = `flex gap-2 justify-center items-center px-5 py-1.5 rounded-full h-10 select-none
					   bg-white/6 border border-white/8 transition-all duration-700 ease-in-out
					   font-funnel-display font-medium
					   ${disabled
						? 'opacity-0 pointer-events-none translate-y-0.5'
						: 'opacity-100 hover:bg-white hover:text-black cursor-pointer'}`;

	return (
		<button onClick={onClick} className={className} disabled={disabled}>
			{actionIcon}
			{children}
		</button>
	);
}

export default function ProfilePreview({ ref, onChange } : ProfilePreviewProps) {
	const t = useTranslations('auth.common');
	const tautherr = useTranslations('auth');

	const {
		loggedInUser,
		apiClient
	} = useAuth();

	const {
		executeAPICall
	} = useAPICall();

	const {
		formData
	} = useFormContext();

	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return ;

		if (file.size > 2 * 1024 * 1024) {
			toastError(tautherr('errorCodes', { code: 'AUTH_FILE_MAX_2MB' }));
			return ;
		}
		if (!['image/jpg', 'image/jpeg', 'image/png'].includes(file.type)) {
			toastError(tautherr('errorCodes', { code: 'AUTH_INVALID_FILE_TYPE' }));
			return ;
		}
		setAvatarFile(file);
		setAvatarPreview(URL.createObjectURL(file));
		onChange(true);
	}

	function handleRemove() {
		if (avatarPreview) URL.revokeObjectURL(avatarPreview);
		setAvatarFile(null);
		setAvatarPreview(null);
		onChange(false);
	}

	function openFilePicker() {
		fileInputRef.current?.click();
	}

	async function handleSubmit() {
		if (!avatarFile) return ;
		const formData = new FormData();
		formData.append('file', avatarFile);

		try {
			await executeAPICall(() => apiClient.user.updateUserAvatar(
				loggedInUser!.id,
				formData
			));
			setAvatarFile(null);
		} catch {} finally {
			onChange(false);
		}
	}

	useEffect(() => {
		return () => {
			if (avatarPreview) URL.revokeObjectURL(avatarPreview);
		};
	}, [avatarPreview]);

	useImperativeHandle(ref, () => ({
		submit: handleSubmit
	}));

	const displayAvatar = avatarPreview || loggedInUser?.avatar_url;

	return (
		<div className='bg-white/2 border border-white/8
						flex flex-col md:flex-row gap-10 items-center w-full rounded-3xl py-7 px-9 justify-between'>
			<div className='flex flex-col md:flex-row items-center md:text-start text-center gap-8'>
				{/* AVATAR + USER INFO */}
				<div className='relative'>
					<label htmlFor='profile-upload'>
						<div className='absolute rounded-full w-full h-full flex justify-center items-center
									bg-black/60 opacity-0 hover:opacity-100 cursor-pointer
									z-1 transition-all duration-500'
						>
							<Upload size={36} />
						</div>
					</label>
					<Avatar
						avatar={displayAvatar}
						className='h-27 w-27 ring-4 ring-white/10 relative'
					/>
				</div>
				<div>
					<h1 className='font-bold text-xl text-white/90 capitalize'>
						{formData.first_name || loggedInUser!.first_name} {formData.last_name || loggedInUser!.last_name}
					</h1>
					<p className='text-white/70'>
						@{formData.username || loggedInUser!.username}
					</p>
					<p className='text-white/70'>
						{formData.email || loggedInUser!.email}
					</p>
					<p className='text-white/70'>
						{formData.bio || loggedInUser!.bio}
					</p>
				</div>
			</div>


			{/* CHANGE/REMOVE PIC BUTTON */}
			{avatarFile ? (
				<Button
					actionIcon={<X size={16} />}
					onClick={handleRemove}
				>
					{t('remove_pic')}
				</Button>
			) : (
				<Button
					actionIcon={<Upload size={16} />}
					onClick={openFilePicker}
				>
					{t('change_pic')}
				</Button>
			)}
			<input
				ref={fileInputRef}
				id='profile-upload'
				type='file'
				accept='image/*'
				className='hidden'
				onChange={handleChange}
			/>
		</div>
	);
}
