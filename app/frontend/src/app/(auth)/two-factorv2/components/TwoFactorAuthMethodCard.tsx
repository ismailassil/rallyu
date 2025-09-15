import { ChevronRight } from "lucide-react";
import React from "react";

type TwoFactorAuthMethodCardProps = {
	title: string;
	icon: React.ReactNode;
	description: string;
	onClick: () => void;
}

export default function TwoFactorAuthMethodCard({ title, icon, description, onClick } : TwoFactorAuthMethodCardProps) {
	return (
		<div className="flex flex-col" onClick={onClick}>
			<div className='group w-full rounded-3xl backdrop-blur-2xl px-5 py-6 border-1 border-white/10 
				flex gap-4 items-center hover:bg-white/1 cursor-pointer transition-all duration-500'>
				{icon}
				<div>
					<h1 className='font-semibold text-2xl mb-1.5 flex items-center gap-4'>{title}</h1>
					<p className='font-light text-white/75'>{description}</p>
				</div>
				<ChevronRight size={36} className='ml-auto'/>
			</div>
		</div>
	);
}
