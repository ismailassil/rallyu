import React, { ChangeEvent } from 'react';
import Image from 'next/image';
import funnelDisplay from '@/app/fonts/FunnelDisplay';
import { Upload, X } from 'lucide-react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';

interface ProfilePreviewProps {
	values: Record<string, string>;
	file: File | null;
	preview: string | null;
	onAdd: (e: ChangeEvent<HTMLInputElement>) => void;
	onRemove: () => void;
}

export default function ProfilePreview({ values, file, preview, onAdd, onRemove } : ProfilePreviewProps) {
	const { user } = useAuth();

	console.log('PROFILE PREVIEW IN SETTINGS: ', user);

	return (
		<div className="flex items-center bg-gradient-to-br from-white/0 to-white/8 border-1 border-white/10 w-full rounded-3xl py-6 px-8 justify-between">
			<div className="flex gap-8">
				<div className="rounded-full h-27 w-27 ring-4 ring-white/10 relative">
					<Image
						src={preview || user!.avatar_url || '/profile/image.png'} // TODO
						alt="Profile Image"
						fill
						className="h-full w-full object-cover rounded-full"
						quality={100}
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
					<h1 className="font-bold text-xl text-white/90 capitalize">
						{values.fname || user!.first_name} {values.lname || user!.last_name}
					</h1>
					<p className={`text-base text-white/70 ${funnelDisplay.className}`}>
						@{values.username || user!.username}
					</p>
					<p className={`text-base text-white/70 ${funnelDisplay.className}`}>
						{values.email || user!.email}
					</p>
					<p className={`text-base text-white/70 ${funnelDisplay.className}`}>
						{values.bio || user!.bio}
					</p>
				</div>
			</div>
			<div className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs h-10`}>
				<div className="flex items-center gap-2 justify-center">
					{file ? (
						<>
							<X size={16} />
							<button onClick={onRemove} className="cursor-pointer text-white/80">
								Remove Picture
							</button>
						</>
					) : (
						<>
							<Upload size={16} />
							<label htmlFor="profile-upload" className="cursor-pointer text-white/80">
								Change Picture
							</label>
						</>
					)}
				</div>
			</div>
		</div>
	);
}