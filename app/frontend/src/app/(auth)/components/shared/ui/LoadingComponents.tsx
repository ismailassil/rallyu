import { Loader } from 'lucide-react';
import React from 'react';

export default function LoadingComponent() {
	return (
		<div className='h-full w-full flex justify-center items-center backdrop-blur-xs'>
			<Loader width={16} height={16} className='animate-spin text-blue-500' />
		</div>
	);
}

export function LoadingPage() {
	return (
		<div className='h-screen w-screen absolute inset-0 flex justify-center items-center backdrop-blur-2xl'>
			<Loader width={16} height={16} className='animate-spin text-blue-500' />
		</div>
	);
}
