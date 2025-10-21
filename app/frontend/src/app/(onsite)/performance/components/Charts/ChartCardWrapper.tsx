import Image from 'next/image';
import React from 'react';

export default function ChartCardWrapper({
	chartTitle,
	children,
	isEmpty,
	className
} : {
	chartTitle: string,
	children: React.ReactNode,
	isEmpty: boolean,
	className: string
}) {
	const finalClassName = `bg-white/2 border border-white/10 rounded-2xl overflow-hidden flex flex-col items-center justify-between select-none ${className}`;

	return (
		<div className={finalClassName}>
			<div className='w-full py-4 text-center'>
				<h1 className='font-funnel-display font-bold text-xl text-white/50 select-none'>{chartTitle}</h1>
			</div>
			{isEmpty ? (
				<div className='h-full flex flex-col justify-center items-center gap-2 px-4'>
				<Image
					src={'/meme/thinking.gif'}
					width={360}
					height={360}
					alt="No data available"
					className="rounded-2xl blur-[1.25px] hover:blur-none transition-all duration-500 hover:scale-102 cursor-grab"
					draggable={false}
				/>
				<h1 className="text-white/60">No data available</h1>
				</div>

			) : (
				children
			)}
		</div>
	);
}
