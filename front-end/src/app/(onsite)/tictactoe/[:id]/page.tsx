"use client";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import GameInfo from "./components/GameInfo";
import GameField from "./components/GameField";

function Page() {
	return (
		<AnimatePresence>
			<motion.main
				initial={{ opacity: 0, scale: 0.7 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 1, delay: 0.2 }}
				className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
			>
				<article className="bg-card border-br-card hide-scrollbar flex h-full w-full justify-center overflow-hidden overflow-y-scroll rounded-2xl border-2">
					{/* <TicTacToe /> */}
					<section className="max-w-300 flex h-full w-full flex-col gap-3 p-5">
						<GameInfo
							player1={{
								img: "/image.png",
								name: "Ismail Assil",
								score: 1,
							}}
							player2={{
								img: "/image_1.jpg",
								name: "Nabil Azouz",
								score: 2,
							}}
						/>
						<GameField />
					</section>
				</article>
			</motion.main>
		</AnimatePresence>
	);
}

export default Page;
