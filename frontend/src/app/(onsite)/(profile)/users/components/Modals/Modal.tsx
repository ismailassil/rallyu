import Background from '@/app/(auth)/components/Background';
import Image from 'next/image';
import React from 'react';

export default function Modal() {
	return (
		<div className='fixed top-0 left-0 bg-black/60 h-full w-full z-200 backdrop-blur-lg
						flex justify-center items-center '>
			<div className='h-[90%] w-[90%] max-w-[1200px] z-201
		 				   bg-[#121212] rounded-4xl '>
				
			</div>
		</div>
	);
}
