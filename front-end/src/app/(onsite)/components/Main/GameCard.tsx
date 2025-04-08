"use client";

import Image from "next/image";

interface GameCardProps {
	src: string;
	position: string;
	isBackground?: true | false;
	background?: string;
	text: string;
	subtext: string;
	textClass: string;
	subtextClass: string;
	transform?: string;
	opacity?: string;
}

export default function GameCard({
	src,
	position,
	text,
	subtext,
	isBackground = true,
	background,
	textClass,
	subtextClass,
	transform = "scale(1.2)",
	opacity = "0.3",
}: GameCardProps) {
	return (
		<div
			className="relative overflow-hidden h-full flex items-center lg:items-start lg:justify-center
					bg-card border-2 border-br-card rounded-lg
					transition-transform duration-500 transform min-h-[180px] max-h-[300px]
					hover:cursor-pointer group hover:-translate-y-2"
		>
			{isBackground && (
				<div
					className="absolute top-0 left-0 -z-1 w-full h-full"
					style={{
						backgroundImage: `url('${background}')`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
						transform: `${transform}`,
						opacity: `${opacity}`,
					}}
				></div>
			)}
			<div className="text-wrap text-left lg:text-center lg:mt-5 lg:mb-5">
				<h1 className="p-12 lg:p-13 leading-13 text-shadow-lg/30">
					<p className={textClass}>{text}</p>
					<p className={subtextClass}>{subtext}</p>
				</h1>
			</div>

			<div className={position}>
				<Image src={src} alt={src} width={1200} height={1200} quality={100} />
			</div>
		</div>
	);
}
