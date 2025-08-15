"use client";

import { AnimatePresence, motion } from "framer-motion";
import Stats from "../../components/Items/Stats";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import ReadyButton from "./components/ReadyButton";
import useUserProfile, { UserProfileType } from "@/app/(onsite)/(user-profile)/users/context/useUserProfile";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import FinishedUI from "./components/FinishedUI";
import unicaOne from "@/app/fonts/unicaOne";

const Brackets = function (props) {
	const { user, api } = useAuth();
	const { slug } = useParams();
	const [tournament, setTournament] = useState();
	const [joined, setJoined] = useState<boolean>();
	const [ready, setReady] = useState<boolean>(false);

	useEffect(() => {
		const loadData = async function () {
			try {
				// Need name of users
				const res = await api.instance.get(`/v1/tournament/${slug}`);

				const data = res.data;

				setTournament(data.data);
				isPlayerJoined(data.data);
			} catch (err) {
				console.error(err);
			}
		};

		loadData();
	}, [slug]);

	const joinTournamentHandler = async (e) => {
		try {
			const res = await api.instance.patch(`/v1/tournament/match/join/${slug}`, { id: user?.id });
			
			console.log(res.data);
			setJoined(true);
		} catch (err: unknown) {
			console.error(err);
		}
	};

	const leaveTournamentHandler = async (e) => {
		try {
			e.preventDefault();
			const res = await api.instance.patch(`/v1/tournament/match/leave/${slug}`, { id: user?.id });

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
		for (let i = 0; data.matches.length - 1; i++) {
			// I need user id 1
			if (data.matches[i].player_1 === user?.id) {
				if (data.matches[i].player_1_ready)
					setReady(true);
				setJoined(true);
				return ;
			}
			if (data.matches[i].player_2 === user?.id) {
				if (data.matches[i].player_2_ready)
					setReady(true);
				setJoined(true);
				return ;
			}
		}
		// }
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
						{tournament && (
							<>
								<div className="mb-20 flex justify-between items-center">
									<h1 className="text-3xl font-medium">{`${tournament?.tournament.title} - Tournament`}</h1>
									{
										tournament.tournament.state == "finished" && 
											<div className={`overflow-hidden bg-card  relative text-lg
															${unicaOne.className} text-blue-400
															rounded-lg min-h-13 flex items-center px-6
															border-1 border-white/10 hover:scale-102 duration-400 transition-all
											`}>
												<p>Tournament is finished</p>
												<div
													className="tournament-bg hover:scale-101 duration-900 absolute left-0 top-0
														h-full w-full opacity-0 transition-all hover:opacity-20"
												/>
											</div>
									}
									{
										tournament.tournament.state == "pending" &&
										!joined ? (
											<button
												className="bg-main min-w-45 min-h-10 hover:scale-102
																group relative flex max-h-10
																cursor-pointer items-center justify-center
																gap-3 overflow-hidden rounded-lg text-sm
																transition-all duration-300
																"
												onClick={joinTournamentHandler}
											>
												Join
											</button>
										) : (
											<button
												className="bg-card border-card min-w-45 min-h-10 hover:scale-102 group
																relative flex max-h-10 cursor-pointer
																items-center justify-center gap-3
																overflow-hidden rounded-lg border text-sm
																transition-all duration-300
																"
												onClick={leaveTournamentHandler}
											>
												Leave
											</button>
										)
									}
								</div>
								<h2 className="text-xl font-bold text-gray-300">Bracket</h2>
								<div className="mb-8 flex justify-evenly font-extralight">
									<p>Semi-final</p>
									<p>Final</p>
								</div>
								<div className="flex w-full items-center justify-center">
									<div className="max-w-3xs mr-[81px] flex w-full flex-col gap-14">
										<div className="bg-card border-br-card relative flex w-full flex-col border-2">
											<div className="flex px-6 py-3">
												<p
													className={winnerStyle(
														0,
														tournament.matches[0].player_1,
														"name"
													)}
												>
													{tournament?.matches[0].player_1 || "TBD"}
												</p>
												<hr />
												<span
													className={winnerStyle(
														0,
														tournament.matches[0].player_1,
														"result"
													)}
												>
													{!tournament?.matches[0].results
														? "-"
														: tournament?.matches[0].results.split("|")[0]}
												</span>
											</div>
											<div className="flex px-6 py-3">
												<p
													className={winnerStyle(
														0,
														tournament.matches[0].player_2,
														"name"
													)}
												>
													{tournament?.matches[0].player_2 || "TBD"}
												</p>
												<hr />
												<span
													className={winnerStyle(
														0,
														tournament.matches[0].player_2,
														"result"
													)}
												>
													{!tournament?.matches[0].results
														? "-"
														: tournament?.matches[0].results.split("|")[1]}
												</span>
											</div>
											<div className="absolute top-1/2 h-px w-[133%] -translate-y-1/2 bg-gray-300 opacity-20"></div>
										</div>
										<div className="bg-card border-br-card  relative flex w-full flex-col border-2">
											<div className="flex px-6 py-3">
												<p
													className={winnerStyle(
														1,
														tournament.matches[1].player_1,
														"name"
													)}
												>
													{tournament.matches[1].player_1 || "TBD"}
												</p>
												<hr />
												<span
													className={winnerStyle(
														1,
														tournament.matches[1].player_1,
														"result"
													)}
												>
													{!tournament.matches[1].results
														? "-"
														: tournament.matches[1].results.split("|")[0]}
												</span>
											</div>
											<div className="flex px-6 py-3">
												<p
													className={winnerStyle(
														1,
														tournament.matches[1].player_2,
														"name"
													)}
												>
													{tournament.matches[1].player_2 || "TBD"}
												</p>
												<hr />
												<span
													className={winnerStyle(
														1,
														tournament.matches[1].player_2,
														"result"
													)}
												>
													{!tournament.matches[1].results
														? "-"
														: tournament.matches[1].results.split("|")[1]}
												</span>
											</div>
											<div className="absolute top-1/2 h-px w-[133%] -translate-y-1/2 bg-gray-300 opacity-20"></div>
										</div>
									</div>
									<div className="h-[157px] w-px bg-gray-300 opacity-20"></div>
									<div className="max-w-3xs ml-[81px] flex w-full flex-col gap-14">
										<div className="bg-card border-br-card  relative flex w-full flex-col border-2">
											<div className="flex px-6 py-3">
												<p
													className={winnerStyle(
														2,
														tournament.matches[2].player_1,
														"name"
													)}
												>
													{tournament.matches[2].player_1 || "TBD"}
												</p>
												<hr />
												<span
													className={winnerStyle(
														2,
														tournament.matches[2].player_1,
														"result"
													)}
												>
													{!tournament.matches[2].results
														? "-"
														: tournament.matches[2].results.split("|")[0]}
												</span>
											</div>
											<div className="flex px-6 py-3">
												<p
													className={winnerStyle(
														2,
														tournament.matches[2].player_2,
														"name"
													)}
												>
													{tournament.matches[2].player_2 || "TBD"}
												</p>
												<hr />
												<span
													className={winnerStyle(
														2,
														tournament.matches[2].player_2,
														"result"
													)}
												>
													{!tournament.matches[2].results
														? "-"
														: tournament.matches[2].results.split("|")[1]}
												</span>
											</div>
											<div className="absolute -left-[33%] top-1/2 h-px w-[133%] -translate-y-1/2 bg-gray-300 opacity-20"></div>
										</div>
									</div>
								</div>
								{
									tournament.tournament.state == "ongoing" && joined &&
										<ReadyButton slug={slug} readyProp={ready} />
								}
								{
									tournament.tournament.state == "finished" &&
										<FinishedUI />
								}
							</>
						)}
					</div>
				</article>
			</motion.main>
		</AnimatePresence>
	);
};
export default Brackets;
