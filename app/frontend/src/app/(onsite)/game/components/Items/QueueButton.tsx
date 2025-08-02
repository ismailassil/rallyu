import geistSans from "@/app/fonts/geistSans";
import { useGameContext } from "../../contexts/gameContext";
import { useTicTacToe } from "@/app/(onsite)/contexts/tictactoeContext";

function QueueButton() {
	const { setLaunch } = useGameContext();
	const { playerOne, setPlayerOne, playerTwo, setPlayerTwo, setPlayers } = useTicTacToe();

	return (
		<button
			className={`${geistSans.className} min-h-11 lg:h-13 lg:min-h-13 bg-main hover:scale-101 hover:text-main hover:ring-3 h-11
						w-full flex-1 cursor-pointer rounded-lg text-base
						font-semibold uppercase ring-white/20 transition-all duration-300 hover:bg-white lg:text-lg
					`}
			onClick={(e) => {
				e.preventDefault();
				const p1 = !playerOne || playerOne === "" ? "Darth Vador" : playerOne;
				const p2 = !playerTwo || playerTwo === "" ? "Lord Voldemort" : playerTwo;
				const updatedPlayers = {
					playerOne: {
						name: p1,
						img: "/profile/darthVader.jpeg",
					},
					playerTwo: {
						name: p2,
						img: "/profile/lordVoldemort.jpeg",
					},
				};
				setPlayers(updatedPlayers);
				setPlayerOne("");
				setPlayerTwo("");
				setLaunch(true);
			}}
		>
			Queue
		</button>
	);
}

export default QueueButton;
