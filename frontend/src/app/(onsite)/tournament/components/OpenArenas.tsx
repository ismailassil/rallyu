import StartButton from "./Items/StartButton";
import Filter from "./Items/Filter";
import TournamentCard from "./Items/TournamentCard";
import { Fragment, useEffect, useState } from "react";
import unicaOne from "@/app/fonts/unicaOne";
import { motion } from "framer-motion";
import { ArrowClockwise, ArrowRight } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface errorObj {
	status: boolean;
	message: string;
}

function OpenArenas({ setValue }: { setValue: (value: boolean) => void }) {
	const router = useRouter();
	const [tournaments, setTournaments] = useState([]);
	const [error, setError] = useState<errorObj>({ status: false, message: "" });

	useEffect(() => {
		const fetchData = async function () {
			try {
				const req = await fetch("http://localhost:3008/api/v1/tournaments");
				console.log("duh");

				const data = await data.json();

				if (!req.ok) throw "Something went wrong!";

				console.log(data[0].title);
				setTournaments(data);
			} catch (err: unknown) {
					if (typeof err === "object")
						setError({
					status: true,
					message: "Something went wrong: Service is currently unavailable.",
				});
			}
		};

		fetchData();
	}, []);

	const refreshPage = function (e) {
		e.preventDefault();
		router.refresh();
	};

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
					className="flex gap-2 bg-red-600 rounded-full px-8 py-4 text-wrap"
				>
					<p className="text-lg">{error.message}</p>
	
				</motion.div>
			)}
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
				{tournaments.length > 0 &&
					tournaments.map((el, i) => {
						if (i == 7) {
							return (
								<button
									key={i}
									className="min-h-15 flex items-center justify-center gap-2 self-center text-sm hover:bg-white hover:text-gray-800"
								>
									Dicover More <ArrowRight />
								</button>
							);
						}

						return (
							<TournamentCard
								key={el.id}
								id={el.id}
								name={el.title}
								active={0}
								isPingPong={el.mode === "ping-pong"}
							/>
						);
					})}
			</motion.div>
		</>
	);
}

export default OpenArenas;
