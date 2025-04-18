"use client";

import { AnimatePresence, motion } from "framer-motion";
import InviteFriend from "./components/InviteFriend";
import GamePanel from "./components/GamePanel";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import { useRouter } from "next/navigation";
import { useGame } from "../contexts/gameContext";

export default function Game() {
	const { gameType, connectivity } = useGame();
	const [launch, setLaunch] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (launch === true && gameType === "tictactoe" && connectivity === "offline")
			setTimeout(() => {
				router.push("/tictactoe/0");
			}, 3000);
	}, [launch, router, gameType, connectivity]);

	return (
		<AnimatePresence>
			<motion.main
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
				className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
			>
				<article
					className="bg-card border-br-card flex h-full w-full justify-center
							rounded-2xl border-2"
				>
					{!launch ? (
						<motion.div
							initial={{ opacity: 0, y: -50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1, delay: 0.2 }}
							className="max-w-300 hide-scrollbar flex h-full w-full
									flex-col gap-3 overflow-y-scroll p-4 pl-3 md:gap-5 lg:flex-row"
						>
							<GamePanel setStart={setLaunch} />
							<InviteFriend />
						</motion.div>
					) : (
						<Loading setStart={setLaunch} />
					)}
				</article>
			</motion.main>
		</AnimatePresence>
	);
}
