'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";

interface AvatarProps {
	avatar: string | null | undefined;
	fallback?: string;
	className?: string;
	alt?: string;
}

export default function Avatar({ avatar, fallback = "/profile/image_1.jpg", className, alt } : AvatarProps)  {
	const { apiClient } = useAuth();
	const [src, setSrc] = useState<string>(fallback);

	useEffect(() => {
		let blobUrl: string | null = null;

		async function loadAvatar() { 
			try {
				if (avatar && avatar.startsWith('blob:')) {
					setSrc(avatar);
					return;
				}

				if (avatar) {
					const avatarBlob = await apiClient.getUserAvatarBlob(avatar);
					blobUrl = URL.createObjectURL(avatarBlob);
					setSrc(blobUrl);
				}
			} catch (err) {
				console.error('Error loading avatar:', err);
				setSrc(fallback);
			}
		}
		loadAvatar();
	}, [avatar, apiClient, fallback]);

	console.log('Avatar component rendering with src:', src);

	return (
		<div className={`rounded-full overflow-hidden relative ${className || ''}`}>
			<Image
				fill
				src={src}
				alt={alt || "Avatar"}
				className='h-full w-full object-cover'
				onError={() => {
					console.log('Error loading image, using fallback.');
					setSrc(fallback);
				}}
				draggable={false}
				unoptimized={true}
			/>
		</div>
	);
};