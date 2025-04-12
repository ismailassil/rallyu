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
	const matchResult =
		score.me === score.opponent ? 0 : score.me > score.opponent ? 1 : -1;
	// const myTooltipId = myName + crypto.randomUUID();
	// const opponentTooltipId = opponent + crypto.randomUUID();

	return (
		<div className="flex justify-between px-5 py-6 items-center hover:cursor-cell bg-card border-2 border-br-card rounded-2xl relative overflow-hidden hover:scale-101 transition-transform duration-400 hover:bg-hbg hover:border-hbbg">
			<div
				className={`absolute -top-1 left-1/2 -translate-x-1/2 w-19 h-8 pb-1 flex justify-center items-end ${matchResult === 0 ? "bg-gray-600" : matchResult >= 1 ? "bg-green-600" : "bg-red-600"} rounded-b-lg ring-2 ring-border-gray-thick/50`}
			>
				<p className="text-sm">
					{matchResult === 0 ? "Draw" : matchResult >= 1 ? "Victory" : "Defeat"}
				</p>
			</div>
			<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-19 h-8 flex justify-center items-center bg-gray-thick rounded-t-lg ring-2 ring-border-gray-thick/50">
				<Image
					src={type === "xo" ? "/XO.svg" : "ping-pong.svg"}
					width={type === "xo" ? 30 : 18}
					height={type === "xo" ? 30 : 18}
					alt="Profile Image"
				/>
			</div>
			<div className="flex gap-4 items-center w-[30%]">
				<div
					className="flex w-[40px] h-[40px] lg:w-[45px] lg:h-[45px]
						rounded-full justify-center aspect-square items-center"
				>
					<Image
						className={`h-full w-full object-cover rounded-full ring-fr-image
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
			<div className="flex gap-4 items-center justify-end w-[30%]">
				<p className="text-wrap text-right truncate">{opponent}</p>
				<div
					className="flex w-[40px] h-[40px] lg:w-[45px] lg:h-[45px]
					rounded-full justify-center aspect-square items-center"
				>
					<Image
						className={`h-full w-full object-cover rounded-full ring-fr-image
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
