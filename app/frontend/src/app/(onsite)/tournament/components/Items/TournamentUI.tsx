import { useEffect, useRef } from "react";
import ProfileHead from "./ProfileHead";
import { motion } from "framer-motion";

type player = {
	name: string;
	img: string;
};

type TournamentUIPropos = {
	players: {
		player1: player;
		player2?: player;
		player3?: player;
		player4?: player;
	};
	semi?: {
		player1: player;
		player2: player;
	};
	winner?: player;
};

function TournamentUI({ players, semi, winner }: TournamentUIPropos) {
	const boxRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let isDraggingHorizontally = false;
		let dragStartX = 0;
		let initialScrollX = 0;

		const scrollContainer = boxRef.current;
		if (!scrollContainer) return;

		const handleMouseDown = (e: MouseEvent) => {
			isDraggingHorizontally = true;
			dragStartX = e.pageX;
			initialScrollX = scrollContainer.scrollLeft;
			scrollContainer.style.cursor = "grabbing";
			scrollContainer.style.userSelect = "none";
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (!isDraggingHorizontally) return;
			const currentX = e.pageX;
			const deltaX = currentX - dragStartX;
			scrollContainer.scrollLeft = initialScrollX - deltaX;
		};

		const handleMouseUp = () => {
			isDraggingHorizontally = false;
			scrollContainer.style.cursor = "";
			scrollContainer.style.userSelect = "auto";
		};

		scrollContainer.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			scrollContainer.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, x: -100 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.2, delay: 0.1 }}
			ref={boxRef}
			className="bg-black/15  cursor-grab overflow-hidden rounded-lg ring-2 ring-white/20"
		>
			<div className="min-w-200 hide-scrollbar flex overflow-y-hidden overflow-x-scroll py-10">
				<ol className="round ml-5 mr-5 flex flex-1 flex-col justify-around gap-5">
					<li className="with-connector tournament-head">
						<ProfileHead img={players.player1.img} />
						<p
							className={`${
								!players.player1?.name
									? "bg-white/3 h-[50%] w-[60%] animate-pulse rounded-sm"
									: ""
							}`}
						>
							{players.player1?.name || ""}
						</p>
					</li>
					<li className="with-connector tournament-head">
						<ProfileHead img={players.player2?.img} />
						<p
							className={`${!players.player2?.name ? "bg-white/3 h-[50%] w-[60%] animate-pulse rounded-sm" : ""}`}
						>
							{players.player2?.name}
						</p>
					</li>
					<li className="with-connector tournament-head">
						<ProfileHead img={players.player3?.img} />
						<p
							className={`${!players.player3?.name ? "bg-white/3 h-[50%] w-[60%] animate-pulse rounded-sm" : ""}`}
						>
							{players.player3?.name}
						</p>
					</li>
					<li className="with-connector tournament-head">
						<ProfileHead img={players.player4?.img} />
						<p
							className={`${!players.player4?.name ? "bg-white/3 h-[50%] w-[60%] animate-pulse rounded-sm" : ""}`}
						>
							{players.player4?.name}
						</p>
					</li>
				</ol>
				<ol className="round ml-5 mr-5 flex flex-1 flex-col justify-around gap-5">
					<li className="with-connector tournament-head">
						<ProfileHead img={semi?.player1.img} />
						<p
							className={`${!semi?.player1.name ? "bg-white/3 h-[50%] w-[60%] animate-pulse rounded-sm" : ""}`}
						>
							{semi?.player1.name}
						</p>
					</li>
					<li className="with-connector tournament-head">
						<ProfileHead img={semi?.player2.img} />
						<p
							className={`${!semi?.player2.name ? "bg-white/3 h-[50%] w-[60%] animate-pulse rounded-sm" : ""}`}
						>
							{semi?.player2.name}
						</p>
					</li>
				</ol>
				<ol className="round round-winner ml-5 mr-5 flex flex-1 flex-col justify-around">
					<li className="with-connector tournament-head">
						<ProfileHead img={winner?.img} />
						<p
							className={`${!winner?.name ? "bg-white/3 h-[50%] w-[60%] animate-pulse rounded-sm" : ""}`}
						>
							{winner?.name}
						</p>
					</li>
				</ol>
			</div>
		</motion.div>
	);
}

export default TournamentUI;
