import React from 'react';

export default function ChartCardWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
	return (
		<div className='chart-card-wrapper h-full rounded-2xl flex flex-col items-center justify-between overflow-hidden'>
			<p className="text-xl text-white/60 font-bold">Time Spent on Platform</p>
			{children}
		</div>
	);
}
