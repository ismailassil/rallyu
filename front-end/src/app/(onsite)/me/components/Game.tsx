"use client";

import Image from "next/image";
// import { Tooltip } from "react-tooltip";

function Game({
	type = "pingpong",
	opponent,
	myName,
	score,
	myImage,
	opponentImage,
	matchxp,
}: {
	type?: "pingpong" | "xo";
	myName: string;
	opponent: string;
	score: { me: number; opponent: number };
	opponentImage: string;
	myImage: string;
	matchxp: number;
}) {
	const matchResult = score.me === score.opponent ? 0 : score.me > score.opponent ? 1 : -1;
	// const myTooltipId = myName + crypto.randomUUID();
	// const opponentTooltipId = opponent + crypto.randomUUID();

	return (
		<div className="bg-card border-br-card hover:scale-101 duration-400 hover:bg-hbg hover:border-hbbg relative flex items-center justify-between overflow-hidden rounded-2xl border-2 px-5 py-6 transition-transform">
			<div
				className={`w-19 absolute -top-1 left-1/2 flex h-8 -translate-x-1/2 items-end justify-center pb-1 ${
					matchResult === 0 ? "bg-gray-600" : matchResult >= 1 ? "bg-green-600" : "bg-red-600"
				} ring-border-gray-thick/50 rounded-b-lg ring-2`}
			>
				<p className="text-sm">
					{matchResult === 0 ? "Draw" : matchResult >= 1 ? "Victory" : "Defeat"}
				</p>
			</div>
			<div className="w-19 bg-gray-thick ring-border-gray-thick/50 absolute -bottom-1 left-1/2 flex h-8 -translate-x-1/2 items-center justify-center rounded-t-lg ring-2">
				<Image
					src={type === "xo" ? "/icons/XO.svg" : "/icons/ping-pong.svg"}
					width={type === "xo" ? 30 : 18}
					height={type === "xo" ? 30 : 18}
					alt="Profile Image"
				/>
			</div>
			<div className="flex w-[30%] items-center gap-4">
				<div
					className="flex aspect-square h-[40px] w-[40px] items-center
						justify-center rounded-full lg:h-[45px] lg:w-[45px]"
				>
					<Image
						className={`ring-fr-image h-full w-full rounded-full object-cover
							${matchResult === 0 ? "ring-3 ring-gray-600" : matchResult >= 1 ? "ring-3 ring-green-500" : "ring-2"}`}
						src={myImage}
						width={100}
						height={100}
						alt="Profile Image"
						// data-tooltip-id={myTooltipId}
						// data-tooltip-content={myName}
						// data-tooltip-place="right"
					/>
					{/* <Tooltip id={myTooltipId} /> */}
				</div>
				<p className="text-wrap truncate">{myName}</p>
			</div>
			<p className="text-xl font-bold">{score.me}</p>
			<div className="text-sm italic text-gray-500">{matchxp} XP</div>
			<p className="text-xl font-bold">{score.opponent}</p>
			<div className="flex w-[30%] items-center justify-end gap-4">
				<p className="text-wrap truncate text-right">{opponent}</p>
				<div
					className="flex aspect-square h-[40px] w-[40px] items-center
					justify-center rounded-full lg:h-[45px] lg:w-[45px]"
				>
					<Image
						className={`ring-fr-image h-full w-full rounded-full object-cover
							${matchResult === 0 ? "ring-3 ring-gray-600" : matchResult <= -1 ? "ring-3 ring-green-500" : "ring-2"}`}
						src={opponentImage}
						width={100}
						height={100}
						alt="Profile Image"
						// data-tooltip-id={opponentTooltipId}
						// data-tooltip-content={opponent}
						// data-tooltip-place="top"
					/>
					{/* <Tooltip id={opponentTooltipId} /> */}
				</div>
			</div>
		</div>
	);
}

export default Game;
