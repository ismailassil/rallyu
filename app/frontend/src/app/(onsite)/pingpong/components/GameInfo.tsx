import geistSans from "@/app/fonts/geistSans";
import Image from "next/image";

function GameInfo() {

	return (
		<>
			<div className="min-h-20 flex max-h-20 select-none items-center justify-between gap-10 px-2">
				<div
					className={`hover:scale-102 flex w-full flex-1 select-none
						items-center gap-5 rounded-full border-2 bg-white/5 p-2 transition-all duration-500
						border-main`}
				>
					<div className="hover:scale-101 flex h-10 w-10 transition-transform duration-200">
						<Image
							className="ring-br-image hover:scale-101 hover:ring-3 h-full
								w-full rounded-full object-cover ring-2 transition-transform duration-500"
							src={"/profile/lordVoldemort.jpeg"}
							alt="Profile Image"
							width={250}
							height={250}
						/>
					</div>
					<p className="text-wrap flex-1">{"plauer"}</p>
				</div>
				<div className={`flex-[0.5] text-center text-4xl ${geistSans.className}`}>pl1</div>
				<div
					className={`bg-white/8 ring-white/15 *:flex *:items-center *:justify-center
					transform-all hover:scale-102 flex h-full w-full flex-[0.5]
					flex-col rounded-full text-center ring-1
					duration-700
					${geistSans.className}`}
				>
					<span className={`flex-1 text-3xl font-light`}>{10}</span>
				</div>
				<div className={`flex-[0.5] text-center text-4xl ${geistSans.className}`}>pl2</div>
				<div
					className={`hover:scale-102 flex w-full flex-1 select-none
							items-center gap-5 rounded-full border-2 bg-white/5 p-2 transition-all duration-500
							border-main`}
				>
					<p className="text-wrap flex-1 text-right">{"plauer2"}</p>
					<div className="hover:scale-101 flex h-10 w-10 transition-transform duration-200">
						<Image
							className="ring-br-image hover:scale-101 hover:ring-3 h-full
						w-full rounded-full object-cover ring-2 transition-transform duration-500"
							src={"/profile/lordVoldemort.jpeg"}
							alt="Profile Image"
							width={250}
							height={250}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default GameInfo;
