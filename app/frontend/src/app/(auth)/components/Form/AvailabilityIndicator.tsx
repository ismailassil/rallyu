import React from 'react';
import { AvailabilityStatus } from '@/app/hooks/useAvailabilityCheck';
import { AlertCircle, CheckCircle2, LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function AvailabilityIndicator({ label, status } : { label: string; status: AvailabilityStatus }) {
	const t = useTranslations('auth.validation.common.availability');

	if (status === 'idle')
		return null;

	function getDisplayInfo(label: string, status: AvailabilityStatus) : { message: string; icon: React.ReactNode; colorClass: string } {
		switch (status) {
			case 'checking':
				return { message: `${t('checking')}`, icon: <LoaderCircle className="animate-spin" size={14}/>, colorClass: 'text-blue-400' };
			case 'available':
				return { message: `${label} ${t('available')}`, icon: <CheckCircle2 className="shrink-0" size={14}/>, colorClass: 'text-green-400' };
			case 'unavailable':
				return { message: `${label} ${t('unavailable')}`, icon: <AlertCircle size={14} className="shrink-0"/>, colorClass: 'text-red-400' };
			case 'error':
				return { message: `${label} ${t('error')}`, icon: <AlertCircle size={14} className="shrink-0"/>, colorClass: 'text-red-400' };
			default:
				return { message: '', icon: '', colorClass: '' };
		}
	};

	const displayInfo = getDisplayInfo(label, status);
	if (!displayInfo.message)
		return null;

	return (
		<motion.div
			key='field-availability'
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
		>
			<div className={`${displayInfo.colorClass} font-light text-xs flex items-center p-1 gap-1.5`}>
				<span>{displayInfo.icon}</span>
				<p>{displayInfo.message}</p>
			</div>
		</motion.div>
	);
}
