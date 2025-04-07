import Image from "next/image";

export default function TrainingMatch() {
	return (
		<div className="relative overflow-hidden h-full rounded-md md:flex md:items-center">
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
			<div className="text-wrap text-center md:text-left">
				<h1 className="p-20 md:p-13 text-2xl leading-13">
					<p className=" text-3xl">Start</p>
					<p className="text-5xl ">Training</p>
				</h1>
			</div>

			<div
				className="absolute w-[400px] h-auto top-61 left-1/2 md:md:top-15 md:translate-x-8 md:w-[320px]
				transform -translate-x-1/2 group-hover:-translate-y-5 group-hover:scale-102 invisible lg:visible
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
