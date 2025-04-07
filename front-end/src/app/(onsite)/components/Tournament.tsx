import Image from "next/image";

export default function Tournament() {
	return (
		<div className="relative overflow-hidden h-full md:flex md:items-center">
			<div className="text-wrap md:text-left text-center">
				<h1 className="md:p-13 p-20 text-2xl leading-13">
					<p className="">Conquer the</p>
					<p className="text-5xl ">Tournament</p>
				</h1>
			</div>

			<div
				className="absolute top-90 w-[650px] h-auto left-1/2 md:top-12 md:translate-x-8 md:w-[350px]
				transform -translate-x-1/2 group-hover:-translate-y-5 group-hover:scale-102 invisible lg:visible
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
