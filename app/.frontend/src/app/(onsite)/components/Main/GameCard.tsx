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
			className="bg-card border-br-card group relative flex h-full max-h-[300px]
					min-h-[180px] transform cursor-pointer items-center
					overflow-hidden rounded-lg border-2 transition-transform
					duration-500 lg:items-start lg:justify-center"
		>
			{isBackground && (
				<div
					className="-z-1 absolute left-0 top-0 h-full w-full"
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
			<div className="text-wrap text-left lg:mb-5 lg:mt-5 lg:text-center">
				<h1
					className="lg:p-13 leading-13 text-shadow-lg/30
						hover:scale-102 origin-bottom p-12 transition-transform duration-500"
				>
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
