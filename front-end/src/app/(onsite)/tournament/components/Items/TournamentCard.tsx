import { ArrowUUpRight } from "@phosphor-icons/react";
import Image from "next/image";

function TournamentCard({
	name,
	active,
	isPingPong,
}: {
	name: string;
	active: number;
	isPingPong: boolean;
}) {
	if (name && name.length > 25) {
		name = name.substring(0, 23) + "...";
	}
	return (
		<div className="*:flex *:justify-between group relative flex select-none flex-col justify-between gap-2 overflow-hidden">
			<div className="z-1 relative flex w-full flex-1 flex-col gap-3">
				<Image
					src={!isPingPong ? "/tictactoe.svg" : "/pingpong.svg"}
					width={70}
					height={70}
					alt="XO Image"
					className="rotate-20 group-hover:-rotate-10 absolute -right-7
						-top-6 transition-all duration-500 group-hover:-right-3 group-hover:-top-3"
				/>
				<p className="font-semibold">{name}</p>
				<div className="flex flex-col gap-2">
					<div className="relative flex justify-between text-sm">
						<p className="font-light">Contenders</p>
						{/* Active players */}
						<p>{active}/4</p>
					</div>
					<button className="hover:bg-main flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-white/20 py-0.5">
						<span className="text-sm">Join</span>{" "}
						<ArrowUUpRight size={16} />
					</button>
				</div>
			</div>
			<div
				className="tournament-bg hover:scale-101 duration-900 -z-1 absolute left-0
					top-0 h-full w-full opacity-0 transition-all group-hover:opacity-30"
			/>
		</div>
	);
}

export default TournamentCard;
