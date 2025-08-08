"use client";

import { AnimatePresence, motion } from "framer-motion";
import Stats from "../../components/Items/Stats";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import ReadyButton from "./components/ReadyButton";
import useUserProfile, { UserProfileType } from "@/app/(onsite)/(user-profile)/users/context/useUserProfile";

const Brackets = function (props) {
	const { slug } = useParams();
	const [tournament, setTournament] = useState();
	const [joined, setJoined] = useState();
	const [ready, setReady] = useState<boolean>(false);

	useEffect(() => {
		const loadData = async function () {
			try {
				const req = await fetch(`http://localhost:3008/api/v1/tournament/${slug}`);

				const data = await req.json();
				if (!req.ok) throw "Something went wrong";

				console.log(data);
				setTournament((prev) => data.data);
				isPlayerJoined(data.data);
			} catch (err) {
				console.error(err);
			}
		};

		loadData();
	}, [slug]);

	const joinTournamentHandler = async (e) => {
		try {
			const req = await fetch(`http://localhost:3008/api/v1/tournament-matches/join/${slug}`, {
				method: "PATCH",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					id: 1, // I need user ID here to make him join the match
				}),
			});

			const data = await req.json();
			if (!req.ok) throw "Something went wrong.";

			console.log(data);
			setJoined(true);
		} catch (err) {
			console.log(err);
		}
	};

	const leaveTournamentHandler = async (e) => {
		try {
			e.preventDefault();

			const req = await fetch(`http://localhost:3008/api/v1/tournament-matches/leave/${slug}`, {
				method: "PATCH",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					id: 1, // I need user ID here to make him join the match
				}),
			});

			const data = await req.json();
			if (!req.ok) throw "Something went wrong.";
			setJoined(false);
		} catch (err) {
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
		// if (!data) {
		// 	for (let i = 0; tournament.matches.length - 1; i++) {
		// 		// I need user id
		// 		if (tournament.matches[0].player_1 === 1 || tournament.matches[0].player_2 === 1)
		// 			return setJoined(true);
		// 	}
		// } else {

		for (let i = 0; data.matches.length - 1; i++) {
			// I need user id 1
			if (data.matches[i].player_1 === 1) {
				if (data.matches[i].player_1_ready)
					setReady(true);
				setJoined(true);
				return ;
			}
			if (data.matches[i].player_2 === 1) {
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
				<article className="bg-card border-br-card flex h-full w-full justify-center rounded-2xl border-2">
					<div className="max-w-300 h-full w-full gap-10 p-4 flex flex-col">
						{tournament && (
							<>
								<div className="mb-20 flex justify-between">
									<h1 className="text-3xl font-medium">{`${tournament?.tournament.title} - Tournament`}</h1>
									{!joined ? (
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
									)}
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
									tournament.tournament.state == "pending" &&
										<ReadyButton slug={slug} readyProp={ready} />
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
