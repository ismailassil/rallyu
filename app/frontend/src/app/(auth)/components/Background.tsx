import React from 'react';
import Image from 'next/image';

export default function Background() {
	return (
		<div className='background fixed top-0 left-0 h-full w-full bg-black -z-[1] brightness-70'>
			<Image
				src='/background/main/signup_background.svg'
				alt='Background'
				fill
				className='object-cover object-center'
			></Image>
		</div>
	);
}
