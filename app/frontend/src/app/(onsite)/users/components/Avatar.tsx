'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { simulateBackendCall } from "@/app/(api)/utils";

interface AvatarProps {
	avatar: string | null | undefined;
	fallback?: string;
	className?: string;
	alt?: string;
}

export default function Avatar({ avatar, fallback = "/profile/image_1.jpg", className, alt } : AvatarProps)  {
	const { apiClient } = useAuth();
	const [src, setSrc] = useState<string>(fallback);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		let blobUrl: string | null = null;

		async function loadAvatar() {
			try {
				setIsLoading(true);

				// If it's already a blob URL
				if (avatar && avatar.startsWith("blob:")) {
					setSrc(avatar);
					return;
				}

				// External URL (e.g., Google)
				if (avatar && (avatar.startsWith("http://") || avatar.startsWith("https://"))) {
					setSrc(avatar);
					return;
				}

				// Local avatar served from your server
				if (avatar) {
					const avatarBlob = await apiClient.getUserAvatarBlob(avatar);
					blobUrl = URL.createObjectURL(avatarBlob);
					setSrc(blobUrl);
				} else {
					setSrc(fallback);
				}
			} catch (err) {
				console.error("Error loading avatar:", err);
				setSrc(fallback);
			} finally {
				setIsLoading(false);
			}
		}

		loadAvatar();

		return () => {
			if (blobUrl) URL.revokeObjectURL(blobUrl); // cleanup
		};
	}, [avatar, apiClient, fallback]);

	return (
		<div className={`rounded-full overflow-hidden relative ${className || ''}`}>
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-black">
					<div className="loader h-full w-full"></div>
				</div>
			)}
			{!isLoading && (
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
			)}
		</div>
	);
};