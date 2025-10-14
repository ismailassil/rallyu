import { useRef, useEffect, useState } from "react"
import SocketProxy from "../../utils/socketProxy"
import { GameMode } from "@/app/(onsite)/game/types/PongTypes"
import RemotePong from "./game/RemotePong";
import LocalPong from "./game/LocalPong";
import { Pause, Play, RotateCcw } from "lucide-react";

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 900;

const Pong = ({ socketProxy, mode, updateTimer }: { socketProxy: SocketProxy | null, mode: GameMode, updateTimer: (timeLeft: number) => void }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const pong = useRef<RemotePong | LocalPong | null>(null);

	useEffect(() => {
		pong.current = mode === 'remote' ? new RemotePong({ updateTimer }) : new LocalPong({ updateTimer });
		const stopGame = pong.current.initGame(canvasRef.current!, socketProxy!);

		return () => {
			if (stopGame) stopGame();
		}
	}, []);

	return (
		<div className="flex w-auto h-auto max-h-full max-w-full items-center justify-center">
			<div className="relative inline-block">
				<canvas
					className='rounded-lg border border-neutral-700 bg-neutral-900/50' //border-neutral-700
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
				<div className="absolute flex justify-center items-center gap-3 right-8 top-5 w-[120px] h-[60px]">
					<button 
						className="rounded-xl border cursor-pointer border-card bg-card transition-all duration-200 hover:bg-white/6 hover:opacity-80 hover:scale-103 active:scale-96 p-2 opacity-50"
						// onClick={}
					>
						<Pause className="w-[35px] h-[35px]" />
						{/* <Play className="w-[35px] h-[35px]" /> */}
					</button>

					<button 
						className="rounded-xl border cursor-pointer border-card bg-card transition-all duration-200 hover:bg-white/6 hover:opacity-80 hover:scale-103 active:scale-96 p-2 opacity-50"
						// onClick={}
					>
						<RotateCcw  className="w-[35px] h-[35px]" />
					</button>
				</div>
			</div>
		</div>
	)
}

{/* <div className="flex w-auto h-auto max-h-full max-w-full items-center justify-center">
			<div className="relative inline-block">
				<canvas
				className="rounded-lg border border-neutral-700 bg-neutral-900/50 block"
				ref={canvasRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				style={{
					width: 'auto',
					height: 'auto',
					maxWidth: '100%',
					maxHeight: '100%',
				}}
				/>

				<div className="absolute inset-0 pointer-events-none flex items-center justify-center">
					<div className="text-white text-sm"></div>
				</div>
			</div>
		</div> */}

export default Pong
