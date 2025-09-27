import React from "react";
import { LoaderCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

export default function CustomToast({ level, message } : { level: string, message: string }) {
	let color;
	let icon;

	switch (level) {
		case 'LOADING':
			color = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
			icon = <LoaderCircle size={20} className="shrink-0 animate-spin"/>;
			break ;
		case 'SUCCESS':
			color = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
			icon = <CheckCircle2 size={20} className="shrink-0"/>;
			break ;
		case 'ERROR':
			color = 'bg-red-500/10 text-red-400 border-red-500/20';
			icon = <AlertCircle size={20} className="shrink-0"/>;
			break ;
		case 'WARNING':
			color = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
			icon = <AlertCircle size={20} className="shrink-0"/>;
			break ;
		default:
			color = 'bg-white/10 text-white/85 border-white/20';
			icon = <AlertCircle size={20} className="shrink-0"/>;
	}

	return (
		<div className={`flex items-center gap-2.5 px-4 py-3 ${color} rounded-xl border text-sm font-semibold`}>
			{icon}
			<span>{message}</span>
		</div>
	);
}

export function toastLoading(message: string) {
	toast.dismiss();
	const id = toast(<CustomToast level='LOADING' message={message || 'Processsing...'} />, {
		unstyled: true, duration: 30000, dismissible: true,
		className: 'w-full flex items-end justify-end cursor-pointer'
	});
	return id;
}

export function toastSuccess(message: string) {
	toast.dismiss();
	const id = toast(<CustomToast level='SUCCESS' message={message || 'Success'} />, {
		unstyled: true, duration: 2000, dismissible: true,
		className: 'w-full flex items-end justify-end cursor-pointer'
	});
	return id;
}

export function toastError(message: string) {
	toast.dismiss();
	const id = toast(<CustomToast level='ERROR' message={message || 'Something went wrong. Try again.'} />, {
		unstyled: true, duration: 6000, dismissible: true,
		className: 'w-full flex items-end justify-end cursor-pointer'
	});
	return id;
}