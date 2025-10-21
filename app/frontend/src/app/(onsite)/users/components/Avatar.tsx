'use client';
import { useEffect, useState } from "react";
import Image from "next/image";

interface AvatarProps {
	avatar: string | null | undefined;
	fallback?: string;
	className?: string;
	alt?: string;
}

export default function Avatar({ avatar, fallback = "/profile/image_1.jpg", className, alt } : AvatarProps)  {
	const [src, setSrc] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {

		if (avatar && avatar.startsWith("blob:")) {
			setSrc(avatar);
		} else if (avatar && avatar.startsWith('/users/avatars/')) {
			setSrc('http://api-gateway:4025/api' + avatar);
		} else {
			setSrc(fallback);
			setIsLoading(false);
		}

	}, [avatar, fallback]);

	if (!src)
		return null;

	return (
		<div className={`rounded-full overflow-hidden relative ${className || ''}`}>
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-black">
					<div className="loader h-full w-full"></div>
				</div>
			)}
			<Image
				fill
				quality={80}
				src={src}
				alt={alt || "Avatar"}
				className='h-full w-full object-cover'
				onLoad={() => {
					setIsLoading(false);
				}}
				onError={() => {
					setSrc(fallback);
					setIsLoading(false);
				}}
				draggable={false}
			/>
		</div>
	);
};
