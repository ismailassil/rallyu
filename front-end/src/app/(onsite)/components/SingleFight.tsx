import Image from "next/image";

export default function SingleFight() {
	return (
		<div className="relative overflow-hidden h-full rounded-md md:flex md:items-center">
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
			<div className="text-wrap text-center md:text-left">
				<h1 className="p-20 md:p-13 text-2xl leading-13">
					<p className="text-5xl ">1v1</p>
					<p className=" text-3xl">Fight for Glory</p>
				</h1>
			</div>

			<div
				className="absolute -top-14 w-[500px] h-auto left-1/2 md:-top-40 md:translate-x-0 md:w-[400px]
				transform -translate-x-1/2 group-hover:-translate-y-5 group-hover:scale-102 invisible lg:visible
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
