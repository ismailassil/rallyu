import StartButton from "./Items/StartButton";
import Filter from "./Items/Filter";
import TournamentCard from "./Items/TournamentCard";
import { Fragment } from "react";
import unicaOne from "@/app/fonts/unicaOne";
import { motion } from "framer-motion";

function OpenArenas({ setValue }: { setValue: (value: boolean) => void }) {
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
					*:py-2 *:min-h-31 *:cursor-cell *:hover:scale-101 *:duration-400
					*:transition-all *:bg-card
					grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 "
			>
				{Array.from({ length: 3 }).map((_, i) => (
					<Fragment key={i * 100}>
						<TournamentCard key={i} name={"Smakso Taile"} active={2} isPingPong={false} />
						<TournamentCard key={i + 10} name={"Exot Timer"} active={0} isPingPong={true} />
					</Fragment>
				))}
			</motion.div>
		</>
	);
}

export default OpenArenas;
