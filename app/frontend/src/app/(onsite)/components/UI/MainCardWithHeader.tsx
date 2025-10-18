import React from 'react';
import MainCardWrapper from './MainCardWrapper';

export default function MainCardWithHeader({ children, className, headerName } : { children: React.ReactNode, className?: string, headerName: string, color?: string }) {
	// const headerColor = color ? `text-${color}` : 'text-white';
	// const divColor = color ? `bg-${color}` : 'bg-white';

	return (
		<MainCardWrapper className={`${className || ''} min-h-130 max-h-full overflow-x-hidden`}>
			<div className="flex h-full flex-col">
				{/* Header */}
				<div className='group relative py-10 px-13 select-none *:transition-all *:duration-500 *:ease-in-out'>
					<h1 className='relative font-bold text-4xl left-0 hover:left-4 text-notwhite'>
						{headerName}
					</h1>
					<div
						className='w-18 h-5 absolute bg-notwhite
								left-0 top-[calc(51%)] -translate-x-1/2 -translate-y-1/2 rounded-full
								transition-all duration-200 group-hover:scale-105'
					></div>
				</div>

				{/* Content */}
				<div className='hide-scrollbar pb-6 overflow-y-auto py-1 h-full'>
					{children}
				</div>

			</div>
		</MainCardWrapper>
	);
}
