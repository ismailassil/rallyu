import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import MainCardWrapper from '../../components/UI/MainCardWrapper';
import { motion, AnimatePresence } from 'framer-motion';

type ActionButtonProps = {
	title?: string;
	icon?: React.ReactNode;
	iconKey?: string;
	onClick?: () => void;
	hidden?: boolean;
	disabled?: boolean;
};

export const ActionButton = ({
	title = 'Action Button',
	icon = <Check size={16} />,
	iconKey = 'check-icon',
	onClick = undefined,
	hidden = false,
	disabled = false
} : ActionButtonProps) => {
	const baseClasses = 'relative w-full flex gap-2 justify-center items-center px-3 md:px-5 py-0 md:py-1.5 text-sm md:text-base rounded-full h-10 select-none font-funnel-display font-medium transition-all duration-500 ease-in-out';
	const hiddenClasses = hidden ? 'opacity-0 pointer-events-none scale-99 translate-y-0.5' : '';
	const disabledClasses = !hidden && disabled ? 'opacity-50 pointer-events-none' : 'hover:bg-white hover:text-black cursor-pointer';
	const combinedClasses = `${baseClasses} bg-white/6 border border-white/8 overflow-hidden ${hiddenClasses} ${disabledClasses}`;

	return (
		<button
			onClick={onClick}
			className={combinedClasses}
			disabled={disabled}
		>
			<AnimatePresence mode='popLayout'>
				<motion.div
					key={iconKey}
					initial={{ y: 35, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -35, opacity: 0 }}
					transition={{ duration: 0.35, ease: 'easeInOut' }}
					className='h-full flex items-center'
				>
					{icon}
				</motion.div>
			</AnimatePresence>
			{title}
		</button>
	);
};

type SettingsCardProps = {
	title: string;
	subtitle: string;
	actionButtonOptions?: ActionButtonProps
	isFoldable?: boolean;
	defaultExpanded?: boolean;
	children?: ReactNode; // content
	className?: string; // of settings card
};

export default function SettingsCard({
	title,
	subtitle,
	actionButtonOptions,
	isFoldable = false,
	defaultExpanded = true,
	children,
	className = '',
}: SettingsCardProps) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	const [height, setHeight] = useState(0);
	const contentRef = useRef<HTMLDivElement | null>(null);

	const toggleExpanded = () => setIsExpanded(prev => !prev);

	useEffect(() => {
		if (contentRef.current) {
			const resizeObserver = new ResizeObserver(() => {
				if (contentRef.current)
					setHeight(contentRef.current.scrollHeight);
			});

			resizeObserver.observe(contentRef.current);
			setHeight(contentRef.current.scrollHeight);

			return () => resizeObserver.disconnect();
		}
	}, [children]);

	return (
		<MainCardWrapper className={className}>
			{/* HEADER */}
			<div className="py-6 md:py-8">
				<div className="flex justify-between items-center pr-6 lg:pr-16">

					{/* HEADER */}
					<div className="flex-1">
						<header className="relative shrink-0 overflow-hidden">
							<h1
								className='font-funnel-display font-semibold pb-0.5 px-10 select-none text-sm sm:text-lg md:text-2xl capitalize relative left-0 hover:left-4 transition-all duration-500'
							>
								{title}
							</h1>
							<div className="w-14 h-2 absolute left-0 top-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
						</header>
						<p className="px-11 text-white/65 text-xs md:text-sm">{subtitle}</p>
					</div>

					{/* FOLD/ACTION BUTTON */}
					<div className="flex items-start gap-3">
						<div className={children ? 'max-md:hidden' : ''}>
							{/* {(onAction || formId) && (
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
							)} */}
							{actionButtonOptions && (
								<ActionButton {...actionButtonOptions} />
							)}
						</div>

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

			{/* CONTENT */}
			<div style={{
				height: isExpanded ? `${height}px` : '0px',
				transition: 'height 0.3s ease-in-out',
				overflow: 'hidden'
			}}>
				<div ref={contentRef}>
					{children && (
						<div className='pb-5 px-5 lg:px-14'>
							{children}
						</div>
					)}
				</div>
			</div>
		</MainCardWrapper>
	);
}
