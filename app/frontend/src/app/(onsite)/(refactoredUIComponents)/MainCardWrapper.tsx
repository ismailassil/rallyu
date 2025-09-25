import React from 'react';

export default function MainCardWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
	return (
		<div className={`main-card-wrapper ${className || ''}`}>
			{children}
		</div>
	);
}
