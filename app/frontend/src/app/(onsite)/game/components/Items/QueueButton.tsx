import { useState, useRef } from "react";
import AnimatedLetters from "./AnimatedLetters";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useGame } from "../../contexts/gameContext";

function QueueButton() {
	const { loggedInUser, apiClient } = useAuth();
	const [ clicked, setClicked ] = useState(false);
	const { setUrl } = useGame();
	const wsRef = useRef<WebSocket | null>(null);

	const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const newClicked = !clicked;
		try {
			if (newClicked) {
				const ws = api.connectWebSocket("/v1/matchmaking/join");
				wsRef.current = ws;

				setClicked(newClicked);
				ws.onopen = () => {
					console.log('WebSocket connected');
					ws.send(JSON.stringify({ id: user?.id }));
				};
				
				ws.onmessage = (event: MessageEvent) => { // message will be 
					const data = JSON.parse(event.data);

					console.log("data from matchmaking ws: ", data);
					setUrl(`/game/${data.roomId}?tempToken=${data.token}`);
					ws.close();
				}
				
			} else if (wsRef.current) {
				wsRef.current.close();
				wsRef.current = null;
			}
		} catch (err: unknown) {
			console.error(err);
		}
	};

	return (
		<button
			onClick={onClick}
		  className="mt-auto rounded-full py-[1.2rem] px-[3rem]
			bg-black text-white uppercase font-black cursor-pointer overflow-hidden
			relative group box-border"
		>
		  <div className={`grid inset-0 absolute text-black bg-white  
			${clicked ? 'translate-y-full': ''}
			transform transition-transform duration-150`
			}>
			<span className=" w-full h-full content-center scale-100 group-hover:scale-110 transform transition-transform duration-300">
				Start
			</span>
		  </div>
		  <div className="inline-flex">
			<AnimatedLetters text="In Queue" trigger={clicked} />
		  </div>
		</button>
	  );
}

export default QueueButton;