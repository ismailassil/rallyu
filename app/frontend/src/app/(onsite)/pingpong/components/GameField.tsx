import Pong from "./Pong";

function GameField() {

	return (
		// <div
		// 	className={`"min-h-200 relative mt-5 flex h-[calc(100%-120px)]	
		// 		w-full items-center justify-center rounded-2xl border-2 border-white/20
		// 		p-10 `}
		// >
		// 		<div
		// 			className={`absolute flex h-full w-full items-center justify-center bg-white/1`}
		// 		>
		// 			<Pong />
		// 		</div>
		// </div>
		<div className="flex items-center justify-center h-full w-full max-sm:px-4 max-sm:py-6 px-6 py-12 overflow-hidden">
			<Pong />
		</div>
	);
}

export default GameField;
