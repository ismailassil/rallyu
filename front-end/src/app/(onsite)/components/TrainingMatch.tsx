import Image from "next/image";

export default function TrainingMatch() {
	return (
		<div
			className="relative overflow-hidden h-full flex items-center lg:items-start lg:justify-center
				bg-card border-2 border-br-card rounded-lg
				transition-transform duration-500 transform
				hover:cursor-pointer group hover:-translate-y-2"
		>
			<div
				className="absolute top-0 left-0 -z-1 w-full h-full"
				style={{
					backgroundImage: "url('/training-dock.svg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					transform: "scale(1.1)",
					opacity: "0.4",
				}}
			></div>
			<div className="text-wrap text-left lg:text-center lg:mt-5 lg:mb-5 lg:text-shadow-md">
				<h1 className="p-20 md:p-13 text-2xl leading-13">
					<p className="text-3xl">Start</p>
					<p className="text-5xl">Training</p>
				</h1>
			</div>

			<div
				className="absolute 
				hidden h-auto left-1/2 -z-1
				md:block md:bottom-0 md:translate-x-8 md:w-[260px]
				lg:-translate-x-1/2 lg:-bottom-14 lg:w-[300px]
				transform group-hover:-translate-y-5 group-hover:scale-102
				transition-transform duration-500"
			>
				<Image
					src="/single.svg"
					alt="Single Racket"
					width={1200}
					height={1200}
					quality={100}
				/>
			</div>
		</div>
	);
}
