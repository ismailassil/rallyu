import React from 'react';
import Image from 'next/image';

export default function Background() {
	return (
		<div className='background fixed top-0 left-0 h-full w-full -z-[1000] brightness-78'>
			<Image
				src='/background/main/background.svg'
				alt='Background'
				fill
				className='object-cover object-center'
			/>
		</div>
	);
}
