import funnelDisplay from '@/app/fonts/FunnelDisplay';
import { Check } from 'lucide-react';
import React, { ReactNode } from 'react';

export default function SettingsCard({ children, title, subtitle, saveChanges = false } : { children: ReactNode, title: string, subtitle: string, saveChanges?: boolean }) {
	return (
		<div className='bg-white/4 border border-white/10 w-full rounded-2xl backdrop-blur-2xl py-8'>
			<div className="flex justify-between pr-12 mb-8">
				<div>
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
				{saveChanges && 
					<div className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs h-10`}>
						<div className="flex items-center gap-2 justify-center">
							<Check size={16}/>
							<button>Save Changes</button>
						</div>
					</div>
				}
			</div>
			{children}
		</div>
	);
}
