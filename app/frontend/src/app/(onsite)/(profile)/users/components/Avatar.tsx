'use client';
import { normalizeAvatarUrl } from "@/app/(api)/utils";
import { useState } from "react";
import Image from "next/image";

interface AvatarProps {
	avatar: string | null | undefined;
	fallback?: string;
	width: number;
	height: number;
	className?: string;
	alt?: string;
}

export default function Avatar({ avatar, fallback = "/profile/image_1.jpg", width, height, className, alt } : AvatarProps)  {
	const [src, setSrc] = useState<string>(normalizeAvatarUrl(avatar as string) || fallback);
  
	return (
		<div className={className || ''}>
			<Image
				src={src}
				alt={alt || "Avatar"}
				width={width}
				height={height}
				className='h-full w-full object-cover'
				onError={() => setSrc(fallback)}
				draggable={false}
			/>
		</div>
	);
};