import Banner from "./Items/Banner";
import Stats from "./Items/Stats";
import { useState } from "react";
import OpenArenas from "./OpenArenas";
import NewTournament from "./NewTournament";
import { AnimatePresence } from "framer-motion";
import Loading from "../../game/components/Loading";

function TournamentPanel() {
	const [newTour, setNewTour] = useState(false);
	const [launchArena, setLaunchArena] = useState(false);

	return (
		<>
			<AnimatePresence>
				{!launchArena ? (
					<>
						<Banner />
						<Stats />
						{!newTour ? (
							<OpenArenas setValue={setNewTour} />
						) : (
							<NewTournament setValue={setNewTour} setEnter={setLaunchArena} />
						)}
					</>
				) : (
					<Loading setStart={setLaunchArena} />
				)}
			</AnimatePresence>
		</>
	);
}

export default TournamentPanel;
