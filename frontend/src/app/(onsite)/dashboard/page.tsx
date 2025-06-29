/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import UserInfo from "../components/Main/UserInfo";
import LeaderboardPanel from "../components/Main/LeaderBoardPanel";
import FriendsPanel from "../components/Main/FriendsPanel";
import GameCard from "../components/Main/GameCard";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/(auth)/components/Loading";

export default function Dashboard() {
	const { isAuthenticated, isLoading, user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		console.log('useEffect in /dashboard');
		console.log('isLoading: ', isLoading);
		console.log('isAuthenticated: ', isAuthenticated);
		if (!isLoading && !isAuthenticated)
			router.replace('/login');
	}, [isLoading, isAuthenticated]);
	
	console.log('User', user);

	if (isLoading) {
		return (
			<main className="pt-30 flex h-[100vh] w-full pb-10 justify-center items-center">
				<LoadingSpinner />
			</main>
		);
	}


	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
		>
			<div className="flex h-full w-full gap-6 rounded-lg">
				<article className="flex-5 flex h-full w-full flex-col gap-4">
					<UserInfo firstname="Ismail" />
					<section
						className="hide-scrollbar flex flex-1 flex-col space-x-4 space-y-4 overflow-x-hidden
							overflow-y-scroll lg:flex-row lg:space-y-0"
					>
						<LeaderboardPanel />
						<div className="flex h-full flex-1 flex-col gap-4">
							<GameCard
								isBackground={false}
								src={"/design/tourn_cup.png"}
								position="absolute 
								hidden h-auto left-1/2 -z-1
								md:block md:-bottom-27 md:translate-x-8 md:w-[260px]
								lg:-translate-x-1/2 lg:-bottom-40 lg:w-[300px]
								transform group-hover:-translate-y-5 group-hover:scale-105
								transition-transform duration-500"
								text="Conquer the"
								textClass="text-2xl lg:text-3xl"
								subtext="Tournament"
								subtextClass="text-4xl lg:text-5xl"
								transform="scale(1.1)"
								opacity="0.5"
							/>
							<GameCard
								src={"/design/racket_r.png"}
								background="/background/side/1vs1-dock.svg"
								position="absolute 
								hidden h-auto left-1/2 -z-1
								md:block md:bottom-0 md:translate-x-8 md:w-[260px]
								lg:-translate-x-1/2 lg:-bottom-14 lg:w-[300px]
								transform group-hover:-translate-y-5 group-hover:scale-105
								transition-transform duration-500"
								text="1v1"
								textClass="text-4xl lg:text-5xl"
								subtext="Fight for Glory"
								subtextClass="text-2xl lg:text-3xl"
							/>
							<GameCard
								src={"/design/single.svg"}
								background="/background/side/training-dock.svg"
								position="absolute 
								hidden h-auto left-1/2 -z-1
								md:block md:bottom-0 md:translate-x-8 md:w-[260px]
								lg:-translate-x-1/2 lg:-bottom-21 lg:w-[300px]
								transform group-hover:-translate-y-5 group-hover:scale-105
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
