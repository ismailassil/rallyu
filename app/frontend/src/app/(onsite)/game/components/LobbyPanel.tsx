import Ping from "./Items/Ping";
import Pong from "./Items/Pong";
import X from "./Items/X";
import O from "./Items/O";

const LobbyPanel = () => {

	return (
		<>
			<div className="flex flex-6 w-full h-full gap-4 flex-col">
				<div className="relative rounded-xl w-full h-full">
					<Ping />
					<Pong />
					<svg className="absolute inset-0 w-full h-full pointer-events-none">
						<line x1="55%" y1="0%" x2="45%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="12 19"/>
					</svg>
				</div>
				<div className="relative rounded-xl w-full h-full">
					<X/>
					<O/>
				</div>
			</div>
		</>
	);
}

export default LobbyPanel;
