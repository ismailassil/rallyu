"use client";

import { AnimatePresence, motion } from "framer-motion";
import InviteFriend from "./components/InviteFriend";
import GamePanel from "./components/GamePanel";
import { useEffect } from "react";
import Loading from "./components/Loading";
import { useRouter } from "next/navigation";
import { useTicTacToe } from "../contexts/tictactoeContext";
import { useGameContext } from "./contexts/gameContext";

export default function Game() {
	const { connectivity } = useTicTacToe();
	const { launch, setLaunch, gameType, ws } = useGameContext();

	const router = useRouter();

	useEffect(() => {
		// let timeoutId: NodeJS.Timeout;

		// if (launch === true && gameType === "tictactoe" && connectivity === "offline") {
		// 	timeoutId = setTimeout(() => {
		// 		router.push("/tictactoe/0");
		// 		setLaunch(false);
		// 	}, 3000);
		// }

		// return () => {
		// 	clearTimeout(timeoutId);
		// };

		if (launch === false) {
			ws.current?.close();
			return ;
		}

		if (ws.current) return;

		const sock = new WebSocket("ws://localhost:3002/api/v1/matchmaking/join");
		ws.current = sock;

        console.log(sock.url);
        
        sock.onopen = () => {
            console.log('Connected to websocket!');
        };

        sock.onmessage = (message) => {
			console.log(JSON.parse(message.data));
        };

		sock.onerror = (event) => {
			console.log(event);
			console.log("Websocket fails!");
			sock.close();
			setLaunch(false);
		};

        sock.onclose = () => {
            console.log("Websocket connection closed!");
			ws.current = null;
        };

		return () => {
			if (ws.current === sock) {
				ws.current?.close();
				ws.current = null;
			}
		};

	}, [launch, router, gameType, connectivity, ws]);

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
							<GamePanel />
							<InviteFriend />
						</motion.div>
					) : (
						<Loading />
					)}
				</article>
			</motion.main>
		</AnimatePresence>
	);
}
