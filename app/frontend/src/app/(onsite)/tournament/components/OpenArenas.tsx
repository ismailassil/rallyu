import StartButton from "./Items/StartButton";
import Filter from "./Items/Filter";
import TournamentCard from "./Items/TournamentCard";
import { Fragment, useEffect, useState } from "react";
import unicaOne from "@/app/fonts/unicaOne";
import { motion } from "framer-motion";
import { ArrowClockwise, ArrowRight } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

interface errorObj {
	status: boolean;
	message: string;
}

function OpenArenas({ setValue }: { setValue: (value: boolean) => void }) {
	const [tournaments, setTournaments] = useState([]);
	const [error, setError] = useState<errorObj>({ status: false, message: "" });
	const { api } = useAuth();

	useEffect(() => {
		const fetchData = async function () {
			try {
				
				const req = await api.instance.get("/v1/tournament/tournaments");
				// const req = await fetch("http://localhost:3008/api/v1/tournaments?userId=1"); // Need user ID
				console.log("duh");

				// const data = await req.json();

				// if (!req.ok) throw "Something went wrong!";

				console.log(req);
				// setTournaments(data.data);
			} catch (err: unknown) {
				// if (typeof err === "object")
				// 	setError({
				// 		status: true,
				// 		message: "Something went wrong: Service is currently unavailable.",
				// 	});
				console.error(err);
			}
		};

		fetchData();
	}, []);

	return (
		<>
			<motion.div
				initial={{ opacity: 0, x: -100 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -100 }}
				transition={{ type: "spring", stiffness: 120 }}
				className="min-h-11 flex items-center justify-between"
			>
				<div>
					<h2 className={`${unicaOne.className} text-xl uppercase md:text-2xl`}>
						<span className="font-semibold">Open Arenas</span>
					</h2>
				</div>
				<div className="flex gap-3">
					<Filter />
					<StartButton setValue={setValue} />
				</div>
			</motion.div>
			{error.status && (
				<motion.div
					initial={{ opacity: 0, x: -100 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -100 }}
					transition={{ type: "spring", stiffness: 120 }}
					className="text-wrap rounded-full bg-red-700 px-8 py-4"
				>
					<p className="text-lg">{error.message}</p>
				</motion.div>
			)}
			{
				!tournaments.length && (
					<motion.div
						initial={{ opacity: 0, x: -100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -100 }}
						transition={{ type: "spring", stiffness: 120 }}
						className="text-wrap flex gap-2 rounded-full bg-card outline-white/20 outline-1 px-8 py-4"
					>
						<p className="text-lg">No available tournaments currently.</p>
					</motion.div>
				)
			}
			{
				tournaments.length > 0 && (
					<motion.div
						initial={{ opacity: 0, x: -100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -100 }}
						transition={{ type: "spring", stiffness: 120 }}
						className="*:border-1 *:border-white/10 *:rounded-sm *:px-2
							*:cursor-pointer *:hover:scale-101 *:duration-400
							*:transition-all
							grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 "
					>
						{
							tournaments.map((el) => {
								return (
									<TournamentCard
										key={el.id}
										id={el.id}
										name={el.title}
										active={el.contenders_joined}
										size={el.contenders_size}
										isPingPong={el.mode === "ping-pong"}
										isUserIn={el?.isUserIn ? true : false}
									/>
								);
							})
						}
					</motion.div>
				)
			}
		</>
	);
}

export default OpenArenas;
