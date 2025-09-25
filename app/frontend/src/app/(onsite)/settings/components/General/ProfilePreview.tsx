import React, { ChangeEvent } from 'react';
import funnelDisplay from '@/app/fonts/FunnelDisplay';
import { Upload, X } from 'lucide-react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import Avatar from '@/app/(onsite)/(profile)/users/components/Avatar';

interface ProfilePreviewProps {
	values: Record<string, string>;
	file: File | null;
	avatarBlobPreview: string | null;
	onAdd: (e: ChangeEvent<HTMLInputElement>) => void;
	onRemove: () => void;
}

export default function ProfilePreview({ values, file, avatarBlobPreview, onAdd, onRemove } : ProfilePreviewProps) {
	const { loggedInUser } = useAuth();

	return (
		<div className="flex items-center bg-gradient-to-br from-white/0 to-white/8 border-1 border-white/10 w-full rounded-3xl py-6 px-8 justify-between">
			<div className="flex gap-8">
				{/* Avatar and User Info */}
				<Avatar
					avatar={avatarBlobPreview || loggedInUser!.avatar_url}
					width={100}
					height={100}
					className='h-27 w-27 ring-4 ring-white/10 relative'
				>
				</Avatar>
				<div>
					<h1 className="font-bold text-xl text-white/90 capitalize">
						{values.fname || loggedInUser!.first_name} {values.lname || loggedInUser!.last_name}
					</h1>
					<p className={`text-base text-white/70 ${funnelDisplay.className}`}>
						@{values.username || loggedInUser!.username}
					</p>
					<p className={`text-base text-white/70 ${funnelDisplay.className}`}>
						{values.email || loggedInUser!.email}
					</p>
					<p className={`text-base text-white/70 ${funnelDisplay.className}`}>
						{values.bio || loggedInUser!.bio}
					</p>
				</div>
			</div>
			<input
				id="profile-upload"
				type="file"
				accept="image/*"
				// className="hidden"
				onChange={onAdd}
			/>
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