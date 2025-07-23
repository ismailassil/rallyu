"use client";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoadingScreen = function (props) {
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		if (!searchParams.get("room_id")) router.replace("/game");

		// I need to check if the room_id plus his userId is valid (! I need to access the GAME SERVICE)
		// (in others if this player actually has a match waiting for him)
		// From here you can get your game started
		// probably the link would be like /game/session/${roomid}
	}, [searchParams, router]);

	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
		>
			<div
				className="bg-card border-br-card flex h-full w-full justify-center
							rounded-2xl border-2"
			>
				<motion.div className="max-w-300 flex h-full w-full flex-col items-center justify-center p-3">
					<h1 className="loadingText text-3xl font-bold lg:text-5xl">
						{"Game Is Loading . . .".split("").map((char, index) => (
							<motion.span
								key={index}
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.05 }}
							>
								{char}
							</motion.span>
						))}
					</h1>
				</motion.div>
			</div>
		</motion.main>
	);
};

export default LoadingScreen;
