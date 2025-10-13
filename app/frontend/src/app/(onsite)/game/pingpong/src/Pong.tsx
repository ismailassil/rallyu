import { useRef, useEffect } from "react"
import SocketProxy from "../../utils/socketProxy"
import { GameMode } from "@/app/(onsite)/game/types/PongTypes"
import RemotePong from "./game/RemotePong";
import LocalPong from "./game/LocalPong";

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 1200;

const Pong = ({ socketProxy, mode }: { socketProxy: SocketProxy | null, mode: GameMode }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const pong = useRef<RemotePong | LocalPong | null>(null);

	useEffect(() => {
		pong.current = mode === 'remote' ? new RemotePong() : new LocalPong();
		const stopGame = pong.current.initGame(canvasRef.current!, socketProxy!);

		return () => {
			if (stopGame) stopGame();
		}
	}, []);

	return (
		<canvas
			className='max-w-full max-h-full rounded-lg border shadow-xl border-neutral-700 bg-neutral-900/50' //border-neutral-700
			ref={canvasRef}
			width={CANVAS_WIDTH}
			height={CANVAS_HEIGHT}
			style={{ 
				width: 'auto',
				height: 'auto',
				maxWidth: '100%',
				maxHeight: '100%'
			}}
		/>
	)
}

export default Pong
