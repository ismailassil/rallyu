import { useRef, useEffect } from "react"
import SocketProxy from "../../utils/socketProxy"
import RemotePong from "./game/RemotePong";
import LocalPong from "./game/LocalPong";

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 900;

const Pong = ({ socketProxy, pong }: { socketProxy: SocketProxy | null, pong: RemotePong | LocalPong }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const stopGame = pong.initGame(canvasRef.current!, socketProxy!);

		return () => {
			if (stopGame) stopGame();
		}
	}, []);

	return (
		<canvas
			className='rounded-lg border shadow-black/80 shadow-2xl border-neutral-700 bg-neutral-900/50' //border-neutral-700
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
