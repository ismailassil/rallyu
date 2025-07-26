import unicaOne from "@/app/fonts/unicaOne";
import { motion } from "framer-motion";
function Stats() {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: -20, scale: 0.9 }}
			transition={{ duration: 1.2 }}
			className={`h-30 lg:h-15 grid w-full grid-cols-2 grid-rows-2 items-center justify-between lg:grid-cols-4
				lg:grid-rows-none ${unicaOne.className} *:bg-card
				*:rounded-lg *:min-h-13 *:flex *:flex-1 *:justify-between *:px-4 *:py-2 *:lg:text-lg *:items-center
				*:border-1 *:border-white/10 *:hover:scale-102 *:duration-400 *:transition-all select-none gap-4
			`}
		>
			<div className="relative overflow-hidden">
				<h3>Tournaments Joined</h3>
				<p className="text-3xl">4</p>
				<div
					className="tournament-bg hover:scale-101 duration-900 absolute left-0 top-0
						h-full w-full opacity-0 transition-all hover:opacity-20"
				/>
			</div>
			<div className="relative overflow-hidden">
				<h3>Cups Won</h3>
				<p className="text-3xl">2</p>
				<div
					className="tournament-bg hover:scale-101 duration-900 absolute left-0 top-0
						h-full w-full opacity-0 transition-all hover:opacity-20"
				/>
			</div>
			<div className="relative overflow-hidden">
				<h3>Games Played</h3>
				<p className="text-3xl">7</p>
				<div
					className="tournament-bg hover:scale-101 duration-900 absolute left-0 top-0
						h-full w-full opacity-0 transition-all hover:opacity-20"
				/>
			</div>
			<div className="relative overflow-hidden">
				<h3>Win Rate</h3>
				<p className="text-3xl">50%</p>
				<div
					className="tournament-bg hover:scale-101 duration-900 absolute left-0 top-0
						h-full w-full opacity-0 transition-all hover:opacity-20"
				/>
			</div>
		</motion.div>
	);
}

export default Stats;
