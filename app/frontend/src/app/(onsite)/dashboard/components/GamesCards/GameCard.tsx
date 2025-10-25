'use client';
import Image from 'next/image';

interface GameCardProps {
	src: string;
	position: string;
	background?: string;
	text: string;
	subtext: string;
	textClass: string;
	subtextClass: string;
	onClick?: () => void
}

export default function GameCard({
	src,
	position,
	text,
	subtext,
	textClass,
	subtextClass,
	onClick
}: GameCardProps) {
	return (
		<div
			className="bg-white/6 border border-white/6 rounded-2xl group relative flex h-full md:max-h-[300px]
					md:min-h-85 transform cursor-pointer items-center w-full
					overflow-hidden transition-transform
					duration-500 md:items-start md:justify-center"
					onClick={onClick}
		>
			<div className="text-wrap text-left sm:mb-5 sm:mt-5 sm:text-center h-full 
					flex items-center sm:items-start">
				<h1
					className="md:p-13 leading-13 text-shadow-lg/30
						hover:scale-102 origin-bottom p-8 transition-transform duration-500"
				>
					<p className={textClass}>{text}</p>
					<p className={subtextClass}>{subtext}</p>
				</h1>
			</div>

			<div className={position}>
				<Image
					src={src}
					alt={src}
					width={1200}
					height={1200}
					quality={100}
				/>
			</div>
			<div className="-z-1 absolute size-full bg-gradient-to-b via-black/60 duration-600 group-hover:opacity-0 from-black/80" />
		</div>
	);
}
