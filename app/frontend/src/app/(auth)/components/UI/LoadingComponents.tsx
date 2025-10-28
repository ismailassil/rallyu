import { Loader } from 'lucide-react';
import React from 'react';

export default function LoadingComponent() {
	return (
		<div className='min-h-24 h-full w-full flex justify-center items-center'>
			<Loader width={16} height={16} className='animate-spin text-white' />
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

export function PlaceholderComponent({ content } : { content: string }) {
	return (
		<div className='min-h-24 h-full w-full flex justify-center items-center text-white/75 text-center'>
			<p>{content}</p>
		</div>
	);
}
