import Ping from "./Ping";
import Pong from "./Pong";
import X from "./X";
import O from "./O";

const LobbyPanel = () => {
	return (
		<>
			<div className="flex flex-3 w-full h-full gap-4 flex-col">
				<div className="relative rounded-xl w-full h-full">
					<Ping />
					<Pong/>
					<svg className="absolute inset-0 w-full h-full pointer-events-none">
						<line x1="55%" y1="0%" x2="45%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="12 19"/>
					</svg>
				</div>
				<div className="relative rounded-xl w-full h-full">
					<X/>
					<O/>
				</div>
			</div>
			<div className="flex-1 border hidden xl:flex border-br-card bg-card rounded-xl h-full w-full">

			</div>
		</>
	);
}

export default LobbyPanel;
