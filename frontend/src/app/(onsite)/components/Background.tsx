import React from 'react';
import Image from 'next/image';
import mainBackground from '../../../../public/background/main/background.svg';

export default function Background() {
	return (
		<div className='background fixed top-0 left-0 h-full w-full bg-black -z-[1000] brightness-60'>
			<Image
				src={mainBackground}
				alt='Background'
				fill
				className='object-cover object-center'
			></Image>
		</div>
	);
}
