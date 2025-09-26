import funnelDisplay from '@/app/fonts/FunnelDisplay';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import React, { ReactNode, useState } from 'react';
import MainCardWrapper from '../../(refactoredUIComponents)/MainCardWrapper';

function Button({ children, actionIcon, onClick, hidden = false, disabled = false  } : { children: ReactNode, actionIcon: React.ReactNode, onClick?: () => void, hidden?: boolean, disabled?: boolean }) {
	return (
		<button
			onClick={onClick}
			className={`flex gap-2 justify-center items-center px-5 py-1.5 rounded-full h-10 select-none
					bg-white/6 border border-white/8 transition-all duration-500 ease-in-out
					font-funnel-display font-medium
						${hidden ? 'opacity-0 pointer-events-none scale-99 translate-y-0.5' : ''}
						${disabled ? 'opacity-50 pointer-events-none' : 'hover:bg-white hover:text-black cursor-pointer'}
					`}
		>
			{actionIcon}
			{children}
		</button>
	);
}

export default function SettingsCard({ 
	children,
	title,
	subtitle,
	isAction = false,
	actionLabel = 'Action',
	actionIcon = <Check size={16} />,
	onAction,
	isForm = false, 
	formSubmitLabel = 'Submit',
	isButtonHidden = false,
	isButtonDisabled = false,
	// formId,
	onSubmit,
	isRadio = false, 
	isFoldable = false, 
	defaultExpanded = true 
  } : { 
	children?: ReactNode, 
	title: string, 
	subtitle: string, 
	isAction?: boolean,
	actionLabel?: string,
	actionIcon?: React.ReactNode,
	onAction?: () => void,
	isForm?: boolean,
	formSubmitLabel?: string,
	isButtonHidden?: boolean,
	isButtonDisabled?: boolean,
	// formId?: string,
	onSubmit?: () => void,
	isRadio?: boolean,
	isFoldable?: boolean,
	defaultExpanded?: boolean 
  }) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<MainCardWrapper>
			{/* Header */}
			<div className="py-8">
				<div className='flex justify-between items-center pr-18'>
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
						{isForm && onSubmit &&
							<Button actionIcon={actionIcon} onClick={onSubmit} disabled={isButtonDisabled} hidden={isButtonHidden}>{formSubmitLabel}</Button>
						}
						{isAction && (
							<div className={`border-1 border-white/10 rounded-full px-3.5 py-1.5 ${funnelDisplay.className} font-medium backdrop-blur-xs h-10
											hover:bg-white hover:text-black transition-all duration-500 cursor-pointer`}>
								<div className="flex items-center gap-2 justify-center cursor-pointer">
									{actionIcon}
									<button className='cursor-pointer' onClick={onAction}>{actionLabel}</button>
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

			{/* Content */}
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

		</MainCardWrapper>
	);
}
