import Ping from "./Items/Ping";
import Pong from "./Items/Pong";
import X from "./Items/X";
import O from "./Items/O";
import unicaOne from "@/app/fonts/unicaOne";
import { useState } from "react";
import QueueToggleButton from "./QueueButton";
import Image from "next/image";

const LobbyPanel = () => {
	const [mode, setMode] = useState('remote');

	return (
		<>
			<div className="flex items-center justify-center flex-col flex-6 w-full px-8 lg:px-20 py-7 h-full gap-4 border rounded-lg bg-card border-card">
				<div className="flex gap-10 w-full h-[70px] min-h-0">
					<button
						className={`flex flex-1 items-center justify-center transition-all duration-200 cursor-pointer active:scale-97 rounded-md bg-white/1 hover:bg-white/2 hover:border-b-4 px-10 h-full ${mode === 'remote' ? 'bg-white/3 border-b-4' : ' border-white/30'}`}
						onClick={() => setMode('remote')}
					>
						<span className={`text-2xl md:text-3xl text-nowrap ${unicaOne.className}`}>Remote</span>
					</button>
					<button
						className={`flex flex-1 items-center justify-center transition-all duration-250 cursor-pointer active:scale-97 rounded-md bg-white/1 hover:bg-white/2 hover:border-b-5 px-10 h-full ${mode === 'local' ? 'bg-white/3 border-b-4' : ' border-white/30'}`}
						onClick={() => setMode('local')}
					>
						<span className={`text-2xl md:text-3xl text-nowrap ${unicaOne.className}`}>Local</span>
					</button>
				</div>
				<div className="flex flex-col *:transition-all *:duration-250 lg:flex-row py-5 max-w-[1000px] gap-4 w-full flex-1">
					<div className={`flex relative flex-1 border border-bg hover:scale-102 cursor-pointer`}>
						{/* <div className="absolute inset-0 w-full h-full bg-blue-900/50"/> */}
						<Image
							src="/design/pong.png"
							alt="PONG"
							width={1080}
							height={1920}
							style={{ width: "auto", height: "auto" }}
							className="rounded-lg w-full h-full object-cover opcaity-70 bg-blue-900/50"
						/>
					</div>
					<div className={`flex flex-1 border border-bg hover:scale-102 cursor-pointer`}>

					</div>
				</div>
				<QueueToggleButton />
				{/* <div className="relative rounded-xl w-full h-full">
					<Ping />
					<Pong />
					<svg className="absolute inset-0 w-full h-full pointer-events-none">
						<line x1="55%" y1="0%" x2="45%" y2="100%" stroke="white" strokeWidth="3" strokeDasharray="14 18"/>
					</svg>
				</div>
				<div className="relative rounded-xl w-full h-full">
					<X/>
					<O/>
				</div> */}
			</div>
		</>
	);
}

export default LobbyPanel;
