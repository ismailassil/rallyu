import React from 'react';

export default function NoteBox({ title, children, className = "" } : { title: string, children: React.ReactNode, className?: string }) {
	return (
		<div className={`bg-blue-500/6 px-6 py-4 rounded-2xl border border-white/8 text-blue-400 ${className}`}>
			<p>
				<span className="font-bold">{title}: </span>
				{children}
			</p>
		</div>
	);
};
