import Banner from "./Items/Banner";
import Stats from "./Items/Stats";
import { useState } from "react";
import OpenArenas from "./OpenArenas";
import NewTournament from "./NewTournament";
import { AnimatePresence } from "framer-motion";

function TournamentPanel() {
	const [newTour, setNewTour] = useState(false);

	return (
		<>
			<AnimatePresence>
				<>
					<Banner />
					<Stats />
					{!newTour ? (
						<OpenArenas setValue={setNewTour} />
					) : (
						<NewTournament setValue={setNewTour} />
					)}
				</>
			</AnimatePresence>
		</>
	);
}

export default TournamentPanel;
