import geistSans from "@/app/fonts/geistSans";
import Image from "next/image";

type player = {
	img: string;
	name: string;
	score: number;
};

function GameInfo({ player1, player2 }: { player1: player; player2: player }) {
	if (player1.name && player1.name.length > 20) player1.name = player1.name.substring(0, 20) + "...";
	if (player2.name && player2.name.length > 20) player2.name = player2.name.substring(0, 20) + "...";

	return (
		<>
			<div className="min-h-20 flex max-h-20 select-none items-center justify-between gap-10 px-2">
				<div
					className="border-white/4 hover:scale-102 flex w-full flex-1 select-none
						items-center gap-5 rounded-full border-2 bg-white/5 p-2 transition-all duration-500"
				>
					<div className="hover:scale-101 flex h-10 w-10 transition-transform duration-200">
						<Image
							className="ring-br-image hover:scale-101 hover:ring-3 h-full
						w-full rounded-full object-cover ring-2 transition-transform duration-500"
							src={player1.img}
							alt="Profile Image"
							width={250}
							height={250}
						/>
					</div>
					<p className="text-wrap flex-1">{player1.name}</p>
				</div>
				<div className={`flex-[0.5] text-center text-4xl ${geistSans.className}`}>{player1.score}</div>
				<div
					className={`bg-white/8 ring-white/15 *:flex *:items-center *:justify-center
					transform-all hover:scale-102 flex h-full w-full flex-[0.5]
					flex-col rounded-full text-center ring-1
					duration-700
					${geistSans.className}`}
				>
					<span className={`flex-1 text-3xl font-light`}>30</span>
				</div>
				<div className={`flex-[0.5] text-center text-4xl ${geistSans.className}`}>{player2.score}</div>
				<div
					className="border-white/4 hover:scale-102 flex w-full flex-1 select-none
				items-center gap-5 rounded-full border-2 bg-white/5 p-2 transition-all duration-500"
				>
					<p className="text-wrap flex-1 text-right">{player2.name}</p>
					<div className="hover:scale-101 flex h-10 w-10 transition-transform duration-200">
						<Image
							className="ring-br-image hover:scale-101 hover:ring-3 h-full
						w-full rounded-full object-cover ring-2 transition-transform duration-500"
							src={player2.img}
							alt="Profile Image"
							width={250}
							height={250}
						/>
					</div>
				</div>
			</div>
			<div className="min-h-10 flex w-full select-none justify-center">
				<p
					className="w-35 border-white/4 hover:scale-102 flex h-full items-center justify-between
							rounded-full border-2 bg-white/5 px-4 transition-all duration-500"
				>
					<span className="font-light">Round</span>&nbsp;
					<span className={`${geistSans.className} text-xl font-bold`}>1</span>
				</p>
			</div>
		</>
	);
}

export default GameInfo;
