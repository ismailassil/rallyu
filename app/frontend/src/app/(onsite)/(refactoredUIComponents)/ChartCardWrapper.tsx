import React from 'react';

export default function ChartCardWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
	return (
		<div className={`chart-card-wrapper h-full rounded-2xl flex flex-col items-center overflow-hidden min-h-80 ${className || ''}`}>
			{children}
		</div>
	);
}
