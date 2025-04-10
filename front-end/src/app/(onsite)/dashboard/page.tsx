"use client";

import UserInfo from "../components/Main/UserInfo";
import LeaderboardPanel from "../components/Main/LeaderBoardPanel";
import FriendsPanel from "../components/Main/FriendsPanel";
import GameCard from "../components/Main/GameCard";
import { motion } from "framer-motion";

export default function Dashboard() {
	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="h-[100vh] pt-30 pl-6 sm:pl-36 pr-6 pb-24 sm:pb-6"
		>
			<div className="h-full w-full rounded-md flex gap-6">
				<article className="h-full w-full flex flex-col gap-6 flex-5">
					<UserInfo />
					<section className="flex flex-col lg:flex-row space-x-6 space-y-6 lg:space-y-0 flex-1 overflow-scroll overflow-x-hidden hide-scrollbar">
						<LeaderboardPanel />
						<div className="flex flex-col gap-6 h-full flex-1">
							<GameCard
								isBackground={false}
								src={"/tourn_cup.png"}
								position="absolute 
								hidden h-auto left-1/2 -z-1
								md:block md:-bottom-27 md:translate-x-8 md:w-[260px]
								lg:-translate-x-1/2 lg:-bottom-40 lg:w-[300px]
								transform group-hover:-translate-y-5 group-hover:scale-102
								transition-transform duration-500"
								text="Conquer the"
								textClass="text-2xl lg:text-3xl"
								subtext="Tournament"
								subtextClass="text-4xl lg:text-5xl"
								transform="scale(1.1)"
								opacity="0.5"
							/>
							<GameCard
								src={"/racket_r.png"}
								background="/1vs1-dock.svg"
								position="absolute 
								hidden h-auto left-1/2 -z-1
								md:block md:bottom-0 md:translate-x-8 md:w-[260px]
								lg:-translate-x-1/2 lg:-bottom-14 lg:w-[300px]
								transform group-hover:-translate-y-5 group-hover:scale-102
								transition-transform duration-500"
								text="1v1"
								textClass="text-4xl lg:text-5xl"
								subtext="Fight for Glory"
								subtextClass="text-2xl lg:text-3xl"
							/>
							<GameCard
								src={"/single.svg"}
								background="/training-dock.svg"
								position="absolute 
								hidden h-auto left-1/2 -z-1
								md:block md:bottom-0 md:translate-x-8 md:w-[260px]
								lg:-translate-x-1/2 lg:-bottom-21 lg:w-[300px]
								transform group-hover:-translate-y-5 group-hover:scale-102
								transition-transform duration-500"
								text="Start"
								textClass="text-2xl lg:text-3xl"
								subtext="Training"
								subtextClass="text-4xl lg:text-5xl"
								transform="scale(1.1)"
								opacity="0.5"
							/>
						</div>
					</section>
				</article>
				<FriendsPanel />
			</div>
		</motion.main>
	);
}
