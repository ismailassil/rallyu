import React from 'react';
import { LoaderCircle } from 'lucide-react';

export default function LoadingSpinner() {
	return (
		<LoaderCircle width={50} height={50} className='animate-spin blur-[1.1px]'/>
	);
}
