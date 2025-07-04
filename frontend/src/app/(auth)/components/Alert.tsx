import React from "react";
import { LoaderCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

export default function Alert({ level, message } : { level: string, message: string }) {
	let color;
	let icon;

	switch (level) {
		case 'LOADING':
			color = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
			icon = <LoaderCircle size={20} className="shrink-0 animate-spin"/>;
			break ;
		case 'SUCCESS':
			color = 'bg-green-500/10 text-green-400 border-green-500/20';
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
		<div className={`w-fit flex items-center gap-2.5 px-4 py-3 ${color} rounded-lg border text-sm font-semibold`}>
			{icon}
			<span>{message}</span>
		</div>
	);
}

export function alertLoading(message: string) {
	const id = toast(<Alert level='LOADING' message={message || 'Processsing...'} />, {
		unstyled: true, duration: Infinity, dismissible: false,
		// className: 'w-full flex items-center justify-center'
		className: 'w-full flex items-end justify-end'
	});
	return id;
}

export function alertSuccess(message: string) {
	const id = toast(<Alert level='SUCCESS' message={message || 'Success'} />, {
		unstyled: true, duration: Infinity, dismissible: false,
		// className: 'w-full flex items-center justify-center'
		className: 'w-full flex items-end justify-end'
	});
	return id;
}

export function alertError(message: string) {
	const id = toast(<Alert level='ERROR' message={message || 'Something went wrong. Try again.'} />, {
		unstyled: true, duration: Infinity, dismissible: false,
		// className: 'w-full flex items-center justify-center'
		className: 'w-full flex items-end justify-end'
	});
	return id;
}