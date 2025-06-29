import React from 'react';
import Image from 'next/image';
import mainBackground from '../../../../public/background/main/background.svg';
import secondaryBackground from '../../../../public/background/main/signup_background.svg';

type BackgroundProps = {
	type: string;
}

export default function Background({ type } : BackgroundProps) {
	const background = type === 'main' ? mainBackground : secondaryBackground;

	return (
		<div className='background fixed top-0 left-0 h-full w-full bg-black -z-[1] brightness-70'>
			<Image
				src={background}
				alt='Background'
				fill
				className='object-cover object-center'
			></Image>
		</div>
	);
}
