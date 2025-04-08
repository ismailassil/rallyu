import Image from "next/image";

export default function SingleFight() {
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
					backgroundImage: "url('/1vs1-dock.svg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					transform: "scale(1.2)",
					opacity: "0.3",
				}}
			></div>
			<div className="text-wrap text-left lg:text-center lg:mt-5 lg:mb-5">
				<h1 className="p-20 md:p-13 text-2xl leading-13">
					<p className="text-5xl">1v1</p>
					<p className="text-3xl">Fight for Glory</p>
				</h1>
			</div>

			<div
				className="absolute
				hidden h-auto left-1/2
				md:block md:-bottom-31 md:translate-x-2 md:w-[360px]
				lg:-bottom-10 lg:-translate-x-1/2 lg:w-[300px]
				transform group-hover:-translate-y-5 group-hover:scale-102
				transition-transform duration-500"
			>
				<Image
					src="/racket_r.png"
					alt="Double Rackets"
					width={1200}
					height={1200}
					quality={100}
				/>
			</div>
		</div>
	);
}
