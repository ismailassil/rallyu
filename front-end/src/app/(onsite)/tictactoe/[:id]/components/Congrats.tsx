import Image from "next/image";
import { ArrowUUpLeft } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useGame } from "@/app/(onsite)/contexts/gameContext";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type gameInfoType = {
	pl1: number;
	pl2: number;
	round: number;
	turn: "pl1" | "pl2";
};

function Congrats({
	gameInfo,
	setGameInfo,
	setGameEnd,
}: {
	gameInfo: gameInfoType;
	setGameInfo: Dispatch<SetStateAction<gameInfoType>>;
	setGameEnd: Dispatch<SetStateAction<boolean>>;
}) {
	const { playerOne, playerTwo } = useGame();
	const [isDraw, setIsDraw] = useState(false);

	const router = useRouter();

	useEffect(() => {
		setIsDraw(gameInfo.pl1 === gameInfo.pl2);
	}, [setIsDraw, gameInfo]);
	const wins = gameInfo.pl1 > gameInfo.pl2 ? playerOne : playerTwo;

	return (
		<>
			{!isDraw && (
				<>
					<motion.div
						className="hover:scale-101 h-50 w-50 relative flex transition-transform duration-200"
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
					>
						<Image
							className="ring-br-image hover:scale-101 hover:ring-3 h-full
									w-full rounded-full object-cover ring-2
									transition-transform duration-500"
							src={wins.img}
							alt="Profile Image"
							width={250}
							height={250}
						/>
						<motion.div
							className="hover:scale-101 h-35 w-35 -bottom-15 absolute left-1/2 flex -translate-x-1/2 transition-transform duration-200"
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.5, delay: 0.3, ease: "backOut" }}
						>
							<Image
								className="object-cover transition-transform duration-500"
								src="/crown.png"
								alt="Crown Image"
								width={250}
								height={250}
							/>
						</motion.div>
					</motion.div>
					<motion.h2
						className="mt-10 text-center text-6xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
					>
						<span className="font-bold">{wins.name}</span> <br />
						<span className="text-5xl">{"WINS!"}</span>
					</motion.h2>
				</>
			)}
			{isDraw && (
				<motion.div
					className="ring-br-image
							hover:scale-101 relative flex h-80 overflow-hidden
							rounded-lg ring-2 transition-transform duration-500"
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				>
					<Image
						className="h-full
									w-full object-cover "
						src={"/meme/draw.jpeg"}
						alt="Meme Image"
						width={500}
						quality={100}
						height={300}
					/>
				</motion.div>
			)}
			<motion.div
				className="mt-10 flex w-full justify-center gap-10"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
			>
				<motion.button
					className="max-w-50 min-h-9 lg:min-h-11 hover:scale-101 hover:bg-main
								h-9 max-h-12 w-full flex-1
								cursor-pointer rounded-full px-10 text-base
								font-semibold uppercase ring-2 ring-white/20
								transition-all duration-500 hover:ring-0
								lg:h-11"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => {
						setGameInfo({ pl1: 0, pl2: 0, round: 1, turn: "pl1" });
						setGameEnd(false);
					}}
				>
					Play Again
				</motion.button>
				<motion.button
					className="max-w-50 min-h-9 lg:min-h-11 hover:scale-101 flex
								h-9 max-h-11 w-full flex-1
								cursor-pointer items-center justify-center gap-2
								rounded-full px-5 text-base font-semibold
								uppercase ring-2 ring-white/20
								transition-all duration-500 hover:bg-red-500 hover:ring-0 lg:h-11"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => {
						router.push("/game");
						// setGameEnd(false);
					}}
				>
					<ArrowUUpLeft size={20} />
					Quit
				</motion.button>
			</motion.div>
		</>
	);
}

export default Congrats;
