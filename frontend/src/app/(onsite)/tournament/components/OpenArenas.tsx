import StartButton from "./Items/StartButton";
import Filter from "./Items/Filter";
import TournamentCard from "./Items/TournamentCard";
import { Fragment, useEffect, useState } from "react";
import unicaOne from "@/app/fonts/unicaOne";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

function OpenArenas({ setValue }: { setValue: (value: boolean) => void }) {
	const [tournaments, setTournaments] = useState([]);

	useEffect(() => {
		const fetchData = async function () {
			try {
				const data = await fetch("http://localhost:3008/api/v1/tournaments");

				const jsonData = await data.json();

				console.log(jsonData[0].title);
				setTournaments(jsonData);
			} catch (err) {
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
				{/* <TournamentCard name={"Summer Party"} active={2} isPingPong={true} /> */}
				{/* <TournamentCard key={i + 10} name={"Exot Timer"} active={0} isPingPong={true} /> */}
			</motion.div>
		</>
	);
}

export default OpenArenas;
