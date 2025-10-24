"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import TournamentPanel from "./components/TournamentPanel";
// import { useAuth } from "../contexts/AuthContext";
import Loading from "./components/Items/Loading";

export default function Dashboard() {
	const [start, setStart] = useState(false);
	// const { socket } = useAuth();

	useEffect(() => {
		// ** This is used to mark all the notification from tournament to dismissed
		// const payload = {
		// 	type: "tournament",
		// 	state: "finished",
		// 	status: "read",
		// };

		// TODO | FIX THE EMIT
		// socket.emit('notification_update_on_type', payload);
	}, []);

	return (
		<AnimatePresence>
			<motion.main
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5 }}
				className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
			>
				<article className="bg-card border-br-card flex h-full w-full justify-center rounded-2xl border-2">
					{!start ? (
						<motion.div
							initial={{ opacity: 0, y: -50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1, delay: 0.2 }}
							className="hide-scrollbar flex h-full w-full flex-col gap-3 overflow-y-scroll p-4 pl-3 md:gap-5"
						>
							<TournamentPanel />
						</motion.div>
					) : (
						<Loading setStart={setStart} />
					)}
				</article>
			</motion.main>
		</AnimatePresence>
	);
}
