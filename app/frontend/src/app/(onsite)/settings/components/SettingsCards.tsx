import funnelDisplay from '@/app/fonts/FunnelDisplay';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import React, { ReactNode, useState } from 'react';

export default function SettingsCard({ 
	children, 
	title, 
	subtitle, 
	onSubmit,
	isForm = false, 
	isRadio = false, 
	isAction = false, 
	isFoldable = false, 
	defaultExpanded = true 
  }: { 
	children?: ReactNode, 
	title: string, 
	subtitle: string, 
	onSubmit?: (data: any) => void,
	isForm?: boolean,
	isRadio?: boolean,
	isAction?: boolean,
	isFoldable?: boolean,
	defaultExpanded?: boolean 
  }) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
	const toggleExpanded = () => {
	  setIsExpanded(!isExpanded);
	};
  
	return (
		<div className='bg-white/4 border border-white/10 w-full rounded-2xl backdrop-blur-2xl'>

			<div className="py-8">
				<div className="flex justify-between items-center pr-18 mb-2">
					<div className="flex-1">
						<header className="relative shrink-0 overflow-hidden">
							<h1
							className={`${funnelDisplay.className} font-semibold pb-0.5 px-10 select-none text-2xl capitalize relative left-0 hover:left-4 transition-all duration-500`}
							>
							{title}
							</h1>
							<div className="w-14 h-2 absolute left-0 top-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
						</header>
						<p className="px-11 text-white/65 text-sm">{subtitle}</p>
					</div>
					
					<div className="flex items-start gap-3">
						{isForm && (
							<div className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs h-10
											hover:bg-white hover:text-black transition-all duration-500 cursor-pointer`}>
								<div className="flex items-center gap-2 justify-center cursor-pointer">
									<Check size={16}/>
									<button className='cursor-pointer' onClick={onSubmit}>Save Changes</button>
								</div>
							</div>
						)}

						{isAction && (
							<div className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs h-10`}>
							<div className="flex items-center gap-2 justify-center">
								<Check size={16}/>
								<button>Delete Account</button>
							</div>
							</div>
						)}
						
						{isFoldable && (
							<button
							onClick={toggleExpanded}
							className="border border-white/10 rounded-full p-2 hover:bg-white/5 transition-all duration-500 backdrop-blur-xs cursor-pointer"
							>
							{isExpanded ? (
								<ChevronUp size={20} className="text-white/70" />
							) : (
								<ChevronDown size={20} className="text-white/70" />
							)}
							</button>
						)}
					</div>
				</div>
			</div>

			{children && (
				<div 
				className={`overflow-hidden transition-all duration-600 ease-in-out ${ 
					isFoldable 
					? (isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0')
					: 'max-h-none opacity-100'
				}`}
				>
					<div className="pb-8">
						{children}
					</div>
				</div>
			)}
		</div>
	);
}


// export default function SettingsCard({ children, title, subtitle, saveChanges = false } : { children: ReactNode, title: string, subtitle: string, saveChanges?: boolean }) {
// 	return (
// 		<div className='bg-white/4 border border-white/10 w-full rounded-2xl backdrop-blur-2xl py-8'>
// 			<div className="flex justify-between pr-12 mb-8">
// 				<div>
// 					<header className="relative shrink-0 overflow-hidden">
// 						<h1
// 						className={`${funnelDisplay.className} font-semibold pb-0.5 px-10 select-none text-2xl capitalize relative left-0 hover:left-4 transition-all duration-500`}
// 						>
// 							{title}
// 						</h1>
// 						<div className="w-14 h-2 absolute left-0 top-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
// 					</header>
// 					<p className="px-11 text-white/65 text-sm">{subtitle}</p>
// 				</div>
// 				{saveChanges && 
// 					<div className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs h-10`}>
// 						<div className="flex items-center gap-2 justify-center">
// 							<Check size={16}/>
// 							<button>Save Changes</button>
// 						</div>
// 					</div>
// 				}
// 			</div>
// 			{children}
// 		</div>
// 	);
// }
