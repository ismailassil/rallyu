"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import FooterPending from "./components/FooterPending";
import FooterGoing from "./components/FooterGoing";
import FooterFinished from "./components/FooterFinished";
import StateStat from "./components/StateStat";
import FooterCancelled from "./components/FooterCancelled";
import Stat from "./components/Stat";
import { CloudWarningIcon } from "@phosphor-icons/react";
import { ArrowLeft } from "lucide-react";
import TournamentUnFound from "./components/TournamentUnFound";
import BracketViewDesktop from "./components/BracketViewDesktop";
import BracketViewMobile from "./components/BracketViewMobile";

const getStartTime = function(matches, player) {
	for (const match of matches) {
		if (match.winner)
			continue ;

		if (player === match.player_1 || player === match.player_2)
			return (match.start_time);
	}
	return (null);
};

const amIwaiting = function(finalMatch, player) {

	if (finalMatch.player_1 !== player && finalMatch.player_2 !== player)
		return (false);
	if (!finalMatch.player_1 || !finalMatch.player_2)
		return (true);

	return (false);
};

const currentUserMatch = function(matches, player) {

	for (const match of matches) {
		if (match.winner)
			continue ;
		if (match.player_1 === player || match.player_2 === player)
			return (match.id);
	}
	
	return (-1);
};

const Brackets = function (props) {
	const { loggedInUser, apiClient } = useAuth();
	const { slug } = useParams();
	const [tournament, setTournament] = useState({});
	const [joined, setJoined] = useState<boolean>(false);
	const [ready, setReady] = useState<boolean>(false);
	const [error, setError] = useState({ status: false, message: "" });

	useEffect(() => {
		const loadData = async function () {
			try {
				// Need name of users
				const res = await apiClient.instance.get(`/v1/tournament/${slug}`);

				const data = res.data;
				
				setTournament(data.data);
				isPlayerJoined(data.data);
				setError({ status: false, message: "" });
			} catch (err) {
				setError({ status: true, message: "Tournament service might not be available at the moment" });
			}
		};

		loadData();
	}, [slug]);

	const joinTournamentHandler = async (e) => {
		try {
			const res = await apiClient.instance.patch(`/v1/tournament/match/join/${slug}`, { id: loggedInUser?.id });
			
			console.log(res.data);
			setJoined(true);
		} catch (err: unknown) {
			console.error(err);
		}
	};

	const leaveTournamentHandler = async (e) => {
		try {
			e.preventDefault();
			const res = await apiClient.instance.patch(`/v1/tournament/match/leave/${slug}`, { id: loggedInUser?.id });

			console.log(res);

			setJoined(false);
		} catch (err: unknown) {
			console.log(err);
		}
	};

	const winnerStyle = (matchNumber, player, type) => {
		const style: string = type === "name" ? "grow" : "font-black";

		if (!tournament.matches[matchNumber].winner) return style.concat("");

		if (!tournament.matches[matchNumber].winner === player) return style.concat(" text-blue-400");

		return style.concat(" opacity-50");
	};

	const isPlayerJoined = (data) => {
		for (let i = 0; i < data.matches.length - 1; i++) {
			// I need user id 1
			if (data.matches[i].player_1 === loggedInUser?.id) {
				if (data.matches[i].player_1_ready)
					setReady(true);
				setJoined(true);
				return ;
			}
			if (data.matches[i].player_2 === loggedInUser?.id) {
				if (data.matches[i].player_2_ready)
					setReady(true);
				setJoined(true);
				return ;
			}
		}
		return setJoined(false);
	};

	return (
		<AnimatePresence>
			<motion.main
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
				className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
			>
				<article className="bg-card border-br-card flex w-full h-full overflow-y-auto custom-scroll justify-center rounded-2xl border-2">
					<div className=" max-w-300 w-full gap-10 p-4 flex flex-col min-h-fit">
						{Object.keys(tournament).length > 0 && (
							<>
								<div className="mb-10 flex gap-4 flex-wrap items-center">
									<div className="md:w-auto w-full">
										<div
											className="bg-white/1 ring-white/13 cursor-pointer rounded-sm ring-1 transition-all
											duration-200 hover:bg-white/5 hover:ring-2 hover:ring-white/20 py-1 px-4 w-fit"
											onClick={(e) => {
												e.preventDefault();
												router.push("/tournament");
											}}
											>
											<ArrowLeft size={24} className="flex-1" />
										</div>
									</div>
									<h1 className="lg:text-3xl md:text-2xl text-xl font-medium mr-auto">
										{`${tournament?.tournament.title} - Tournament ${tournament.tournament.mode === "ping-pong" ? "🏓" : "🌌"}`}
									</h1>
									<div>
										{
											tournament.tournament.state == "pending" && 
												<StateStat color="text-purple-400" statement="Tournament has not started" />
										}
										{
											tournament.tournament.state == "ongoing" && 
												<StateStat color="text-yellow-400" statement="Tournament in progress" />
										}
										{
											tournament.tournament.state == "finished" &&
												<StateStat color="text-blue-400" statement="Tournament is completed" />
										}
										{
											tournament.tournament.state == "cancelled" &&
												<StateStat color="text-red-400" statement="Tournament is cancelled" />
										}
									</div>
								</div>
								<div 
									className=" grid w-full grid-cols-1 items-center justify-between md:grid-cols-2
												lg:grid-rows-none gap-4 mb-10"
								>
									<Stat subject="Host" result={tournament.tournament.host_username} />
									<Stat subject="Start Date" result={tournament.tournament.start_date.replace("T", " ")} />
									<Stat subject="Contenders Size" result=
										{`${tournament.tournament.contenders_joined}/${tournament.tournament.contenders_size}`}
									/>
									<Stat subject="Mode" result={tournament.tournament.mode} />
								</div>
								<h2 className="text-xl font-bold text-gray-300">Bracket</h2>
								<BracketViewDesktop matches={tournament.matches} />
								<BracketViewMobile matches={tournament.matches} />
								<>
									{
										tournament.tournament.state == "pending" &&
											<FooterPending 
												joined={joined}
												setJoined={setJoined}
												slug={slug}
												title={tournament?.tournament.title} 
												full={tournament.tournament.contenders_size === tournament.tournament.contenders_joined}
											/>
									}
								</>
								<>
									{
										tournament.tournament.state == "ongoing" &&
											<FooterGoing
												readyProp={ready}
												joined={joined}
												startTime={!joined ? null : getStartTime(tournament.matches, user?.id)}
												waiting={amIwaiting(tournament.matches[2], user?.id)}
												matchId={currentUserMatch(tournament.matches, user.id)}
											/>
									}
								</>
								<>
									{
										tournament.tournament.state == "finished" &&
											<FooterFinished winner={tournament.matches[2].winner_username} />
									}
								</>
								<>
									{
										tournament.tournament.state == "cancelled" &&
											<FooterCancelled title={tournament?.tournament.title} cancelReason={tournament.tournament.cancellation_reason} />
									}
								</>
							</>
						)}
						{
							Object.keys(tournament).length <= 0 && !error.status &&
								<TournamentUnFound />
						}
						{ 
							error.status && 
								<div className="bg-red-700 flex gap-1 items-center justify-start py-5 px-5 rounded-full">
									<CloudWarningIcon className="text-2xl sm:text-xl self-start sm:self-center" />
									<p className="text-sm md:text-base">{ error.message }</p>
								</div>
						}
					</div>
				</article>
			</motion.main>
		</AnimatePresence>
	);
};
export default Brackets;
