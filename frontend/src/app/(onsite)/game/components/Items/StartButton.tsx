import geistSans from "@/app/fonts/geistSans";
import { useGameContext } from "../../contexts/gameContext";
import { useTicTacToe } from "@/app/(onsite)/contexts/tictactoeContext";

const joinMatch = async function () {
	try {
		const response = await fetch("http://localhost:3002/api/v1/matchmaking/join", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: 1 }), // I need User-id
		});
		if (!response.ok)
			throw "Can't Join Now";
		
		const json = await response.json();
		
		console.log(json);
		return (true);
	} catch (err) {
		return (false);
	}
};

function StartButton() {
	const { setLaunch } = useGameContext();
	const { playerOne, setPlayerOne, playerTwo, setPlayerTwo, setPlayers } = useTicTacToe();

	return (
		<button
			className={`${geistSans.className} min-h-11 lg:h-13 lg:min-h-13 bg-main hover:scale-101 hover:text-main hover:ring-3 h-11
						w-full flex-1 cursor-pointer rounded-md text-base
						font-semibold uppercase ring-white/20 transition-all duration-300 hover:bg-white lg:text-lg
					`}
			onClick={async (e) => {
				e.preventDefault();

				// 	Requesting to join a match!
				const results = await joinMatch();

				if (!results) {
					console.log("Service not avaible!");
					return ;
				}

				setLaunch(true);

				// const p1 = !playerOne || playerOne === "" ? "Darth Vador" : playerOne;
				// const p2 = !playerTwo || playerTwo === "" ? "Lord Voldemort" : playerTwo;
				// const updatedPlayers = {
				// 	playerOne: {
				// 		name: p1,
				// 		img: "/profile/darthVader.jpeg",
				// 	},
				// 	playerTwo: {
				// 		name: p2,
				// 		img: "/profile/lordVoldemort.jpeg",
				// 	},
				// };
				// setPlayers(updatedPlayers);
				// setPlayerOne("");
				// setPlayerTwo("");
			}}
		>
			Start The Game
		</button>
	);
}

export default StartButton;
