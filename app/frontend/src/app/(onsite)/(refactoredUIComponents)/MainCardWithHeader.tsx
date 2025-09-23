import React from 'react';
import MainCardWrapper from './MainCardWrapper';

export default function MainCardWithHeader({ children, className, headerName, headerColor }: { children: React.ReactNode, className?: string, headerName: string, headerColor?: string }) {
	return (
		<MainCardWrapper className={`${className || ''} min-h-130 max-h-full overflow-x-hidden`}>
			<div className="flex h-full flex-col">
				{/* Header */}
				<div className='group relative py-10 px-13 select-none *:transition-all *:duration-500 *:ease-in-out'>
					<h1 className='relative font-bold text-4xl left-0 hover:left-4'>
						{headerName}
					</h1>
					<div
						className="w-18 h-5 absolute
								left-0 top-[calc(51%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0]
								transition-all duration-200 group-hover:scale-105"
					></div>
				</div>
				<div className='hide-scrollbar max-h-190 pb-6 overflow-y-auto'>
					{children}
				</div>

			</div>
		</MainCardWrapper>
	);
}
