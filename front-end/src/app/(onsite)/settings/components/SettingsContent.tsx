import { GameController, GearFine, Lock } from "@phosphor-icons/react";
import { useState } from "react";
import General from "./General";
import GameUI from "./GameUI";
import Security from "./Security";
import { AnimatePresence } from "framer-motion";

function SettingsContent() {
	const [section, setSection] = useState<number>(0);

	const sections = [
		{ title: "General", icon: <GearFine size={19} /> },
		{ title: "Game UI", icon: <GameController size={19} /> },
		{ title: "Security", icon: <Lock size={19} /> },
	];

	return (
		<section className="flex h-full w-full flex-1 flex-col gap-3 overflow-hidden">
			<nav className="w-full pt-3">
				<ul
					className="*:rounded-full *:border-2 *:border-white/10
					*:px-3 *:py-0.5 *:hover:bg-white *:hover:text-black
					*:hover:cursor-pointer *:flex *:gap-2 *:items-center
					*:transform *:duration-300 flex gap-4 overflow-hidden
					text-sm lg:text-base
					"
				>
					{sections.map((li, i) => (
						<li
							key={i}
							className={
								section === i ? "bg-white text-black" : ""
							}
							onClick={(e) => {
								e.preventDefault();
								setSection(i);
							}}
						>
							{li.icon}
							<p>{li.title}</p>
						</li>
					))}
				</ul>
			</nav>
			<AnimatePresence>
				<section
					className="bg-card border-br-card divide-white/15 divide-y-1 divide custom-scroll
					flex h-[calc(100%-53px)] w-full flex-col items-center justify-between overflow-y-scroll
					rounded-lg border-2"
				>
					{section === 0 && <General />}
					{section === 1 && <GameUI />}
					{section === 2 && <Security />}
				</section>
			</AnimatePresence>
		</section>
	);
}

export default SettingsContent;
