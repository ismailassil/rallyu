import React from 'react';
import { Check } from 'lucide-react';

export default function SetupComplete() {
	return (
		<>
			<Check className='h-22 w-22 bg-blue-500/25 rounded-full p-5 self-center'/>
			<div className='flex flex-col gap-2 px-6 items-center'>
				<div className='flex gap-4'>
					<h1 className='font-semibold text-3xl text-center'>2FA Setup Complete</h1>
				</div>
				<p className='mb-0 text-white/85 text-center'>Your account is now protected with two-factor authentication.</p>
			</div>
			<button className='h-11 bg-blue-600 hover:bg-blue-700 rounded-lg mt-2'>Continue to Dashboard</button>
		</>
	);
}
