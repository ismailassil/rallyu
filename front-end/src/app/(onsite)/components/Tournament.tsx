import Image from "next/image";

export default function Tournament() {
	return (
		<div
			className="relative overflow-hidden flex-1 h-full flex items-center lg:items-start lg:justify-center 
						w-full bg-card border-2 border-br-card rounded-lg
						transition-transform duration-500 transform
						hover:cursor-pointer group hover:-translate-y-2"
		>
			<div className="text-wrap text-left lg:text-center lg:mt-10 lg:mb-10">
				<h1 className="md:p-13 p-20 text-2xl leading-13">
					<p className="">Conquer the</p>
					<p className="text-5xl ">Tournament</p>
				</h1>
			</div>

			<div
				className="absolute
				hidden left-1/2 w-[650px] h-auto transform
				md:block md:bottom-10 md:w-[350px] -z-1
				lg:w-[500px] lg:-bottom-50 lg:-translate-x-1/2
				group-hover:-translate-y-5 group-hover:scale-102
				transition-transform duration-500"
			>
				<Image
					src="/tourn_cup.png"
					alt="Tournament Cup"
					width={1200}
					height={1200}
					quality={100}
				/>
			</div>
		</div>
	);
}
