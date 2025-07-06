import funnelDisplay from "@/app/fonts/FunnelDisplay";
import Image from 'next/image';

export default function RelationButton({ text, icon, onClick } : { text: string, icon: string, onClick: () => void } ) {
	return (
		<>
			<div className={`flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center ${funnelDisplay.className}
							h-11 bg-white/4 rounded-xl border border-white/10 backdrop-blur-2xl transition-all duration-200
							hover:bg-white/6 hover:scale-102`}
				 onClick={onClick}
			>
				<Image
					alt={text}
					src={icon}
					height={20}
					width={20}
				>
				</Image>
				<p className='text-lg text-white/85'>{text}</p>
			</div>
		</>
	);
}
