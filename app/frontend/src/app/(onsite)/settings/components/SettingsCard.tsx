import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import React, { ReactNode, useState } from 'react';
import MainCardWrapper from '../../components/UI/MainCardWrapper';

type ActionButtonProps = {
	children: ReactNode;
	actionIcon?: React.ReactNode;
	onClick?: () => void;
	hidden?: boolean;
	disabled?: boolean;
	type?: 'button' | 'submit';
	formId?: string;
};

export const ActionButton = ({
	children,
	actionIcon,
	onClick,
	hidden = false,
	disabled = false,
	type = 'button',
	formId,
}: ActionButtonProps) => {
	const baseClasses = 'flex gap-2 justify-center items-center px-5 py-1.5 rounded-full h-10 select-none font-funnel-display font-medium transition-all duration-500 ease-in-out';
	const hiddenClasses = hidden ? 'opacity-0 pointer-events-none scale-99 translate-y-0.5' : '';
	const disabledClasses = !hidden && disabled ? 'opacity-50 pointer-events-none' : 'hover:bg-white hover:text-black cursor-pointer';
	const combinedClasses = `${baseClasses} bg-white/6 border border-white/8 ${hiddenClasses} ${disabledClasses}`;

	return (
		<button type={type} form={formId} onClick={onClick} className={combinedClasses} disabled={disabled}>
			{actionIcon}
			{children}
		</button>
	);
};

type SettingsCardProps = {
	children?: ReactNode;
	title: string;
	subtitle: string;
	actionLabel?: string;
	actionIcon?: React.ReactNode;
	onAction?: () => void;
	isButtonHidden?: boolean;
	isButtonDisabled?: boolean;
	isFoldable?: boolean;
	defaultExpanded?: boolean;
	formId?: string;
};

export default function SettingsCard({
	children,
	title,
	subtitle,
	actionLabel = 'Save Changes',
	actionIcon = <Check size={16} />,
	onAction,
	isButtonHidden = false,
	isButtonDisabled = false,
	isFoldable = false,
	defaultExpanded = true,
	formId,
}: SettingsCardProps) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);

	const toggleExpanded = () => setIsExpanded(prev => !prev);

	return (
		<MainCardWrapper>
			{/* Header */}
			<div className="py-8">
				<div className="flex justify-between items-center pr-18">
					<div className="flex-1">
						<header className="relative shrink-0 overflow-hidden">
							<h1
								className='font-funnel-display font-semibold pb-0.5 px-10 select-none text-2xl capitalize relative left-0 hover:left-4 transition-all duration-500'
							>
								{title}
							</h1>
							<div className="w-14 h-2 absolute left-0 top-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
						</header>
						<p className="px-11 text-white/65 text-sm">{subtitle}</p>
					</div>

					{/* Fixed Action Button and Fold */}
					<div className="flex items-start gap-3">
						{(onAction || formId) && (
							<ActionButton
								actionIcon={actionIcon}
								onClick={onAction}
								hidden={isButtonHidden}
								disabled={isButtonDisabled}
								type={formId ? 'submit' : 'button'}
								formId={formId}
							>
								{actionLabel}
							</ActionButton>
						)}

						{isFoldable && (
							<button
								onClick={toggleExpanded}
								className="border border-white/10 rounded-full p-2 hover:bg-white/5 transition-all duration-500 backdrop-blur-xs cursor-pointer"
							>
								{isExpanded ? <ChevronUp size={20} className="text-white/70" /> : <ChevronDown size={20} className="text-white/70" />}
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Content */}
			{children && (
				<div
					className={`overflow-hidden transition-all duration-600 ease-in-out ${
						isFoldable ? (isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0') : 'max-h-none opacity-100'
					}`}
				>
					<div className="pb-8">{children}</div>
				</div>
			)}
		</MainCardWrapper>
	);
}
