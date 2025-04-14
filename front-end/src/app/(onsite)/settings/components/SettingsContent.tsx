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
		<section className="h-full w-full flex-1 flex flex-col gap-3 overflow-hidden">
			<nav className="w-full pt-3">
				<ul
					className="flex gap-4 overflow-hidden
					*:rounded-full *:border-2 *:border-white/10 *:px-3
					*:py-0.5 *:hover:bg-white *:hover:text-black *:hover:cursor-pointer
					*:flex *:gap-2 *:items-center *:transform *:duration-300
					text-sm lg:text-base
					"
				>
					{sections.map((li, i) => (
						<li
							key={i}
							className={section === i ? "bg-white text-black" : ""}
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
					className="h-[calc(100%-53px)] w-full bg-card border-2 border-br-card rounded-lg
					divide-white/15 divide-y-1 divide flex flex-col justify-between items-center
					custom-scroll overflow-y-scroll"
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
