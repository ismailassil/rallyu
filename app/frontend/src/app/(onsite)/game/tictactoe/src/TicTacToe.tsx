import RemoteXO from "./game/RemoteXO";
import LocalXO from "./game/LocalXO";


const TicTacToe = ({ tictactoe }: { tictactoe: RemoteXO }) => {

	return (
        <div className="rounded-lg border shadow-black/80 shadow-2xl border-neutral-700 bg-neutral-900/50 w-[1600px] h-[900px] min-w-0 min-h-0 max-w-full max-h-full">

        </div>
		// <canvas
		// 	className='rounded-lg border shadow-black/80 shadow-2xl border-neutral-700 bg-neutral-900/50' //border-neutral-700
		// 	ref={canvasRef}
		// 	width={CANVAS_WIDTH}
		// 	height={CANVAS_HEIGHT}
		// 	style={{ 
		// 		width: 'auto',
		// 		height: 'auto',
		// 		maxWidth: '100%',
		// 		maxHeight: '100%'
		// 	}}
		// />
	)
}

export default TicTacToe
