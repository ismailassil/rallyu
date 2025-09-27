import React from 'react';
import { Loader, LoaderCircle } from 'lucide-react';
import Background from './Background';

export function AuthLoadingSpinner() {
	return (
		<div className="min-h-screen min-w-screen flex items-center justify-center fixed top-0 backdrop-blur-3xl z-1000">
			<Loader width={24} height={24} className='animate-spin' />
		</div>
	);
}

export function ResourceLoadingSpinner() {
	return (
		<div className="min-h-screen min-w-screen flex items-center justify-center fixed top-0 backdrop-blur-3xl z-1000">
			<LoaderCircle width={24} height={24} className='animate-spin' />
		</div>
	);
}

export function LoadingPage() {
	return (
		<div className="min-h-screen min-w-screen flex items-center justify-center">
			<Loader width={16} height={16} className='animate-spin' />
		</div>
	);
}
