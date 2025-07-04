import React from 'react';
import { useEffect, useState } from 'react';

export default function ProgressBar({ message, complete } : { message?: string, complete: boolean } ) {
	// const [progress, setProgress] = useState(0);
	const progress = 10;

	// useEffect(() => {
	// 	const timeout = setTimeout(() => {
	// 		setProgress(90);
	// 	}, 2000);

	// 	const timeout1 = setTimeout(() => {
	// 		setProgress(10);
	// 	}, 1000);
	
	// 	return () => { clearTimeout(timeout); clearTimeout(timeout1); };
	// }, []);
	
	return (
		<div className="min-h-screen min-w-screen flex items-center justify-center fixed top-0 backdrop-blur-3xl z-1000">
			<div className="w-full max-w-md space-y-6">
				{ message && <h2 className="text-center text-3xl font-semibold text-white animate-pulse">{message}</h2> }
				<div className="w-full bg-white/15 rounded-full h-1.5">
					<div 
					className={`h-full bg-white ${complete ? 'rounded-full' : 'rounded-s-full'} transition-all duration-400`}
					style={{ width: `${complete ? 100 : progress}%` }}
					></div>
				</div>
			</div>
		</div>
	);
}
