import unicaOne from "@/app/fonts/unicaOne";
import { ReactNode, useState } from "react";
import QueueToggleButton from "./QueueButton";
import { GameMode, GameType } from "../types/types";
import { Check, Globe, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

const GameCard = ({ selected, setType, children }: { selected: boolean, setType: () => void, children: ReactNode }) => {
	return (
		<div
			className={`relative flex flex-1 shadow-2xl shadow-black/30 rounded-lg cursor-pointer overflow-hidden active:scale-98 ${
				selected
				? 'border-6'
				: 'hover:scale-102 border border-white/30'
			}`}
			onClick={() => setType()}
		>
			{children}
			{selected && (
				<motion.div
					initial={{ opacity: 0, x: 12, y: 12 }}
					animate={{ opacity: 1, x: 0, y: 0 }}
					exit={{ opacity: 0, x: 12, y: 12 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					className="absolute -right-1.5 -bottom-1.5"
				>
					<div className="w-8 h-8 bg-white/90 rounded-tl-lg flex items-center justify-center">
						<Check strokeWidth={4} className="text-black w-5 h-5" />
					</div>
				</motion.div>
			)}
		</div>
	)
}

const LobbyPanel = () => {
	const [mode, setMode] = useState<GameMode>('remote');
	const [type, setType] = useState<GameType>('pingpong');
	const t = useTranslations();

	return (
		<div className="flex items-center justify-center flex-col flex-4 w-full px-8 lg:px-20 py-10 h-full gap-4 border rounded-lg bg-card border-card">
			<div className="flex gap-4 w-full max-w-[1000px] h-[70px] min-h-0">
				<button
					className={`flex flex-1 items-center justify-center transition-all duration-200 cursor-pointer active:scale-97 rounded-md bg-white/1 hover:bg-white/2 hover:border-b-4 px-10 h-full ${mode === 'remote' ? 'bg-white/3 border-b-4' : ' border-white/30'}`}
					onClick={() => setMode('remote')}
				>
					<Globe className="w-8" strokeWidth={1.5} />
					<span className={`text-2xl md:text-3xl text-nowrap uppercase ${unicaOne.className}`}>{t("lobby.remote")}</span>
				</button>
				<button
					className={`flex flex-1 items-center justify-center transition-all duration-250 cursor-pointer active:scale-97 rounded-md bg-white/1 hover:bg-white/2 hover:border-b-5 px-10 h-full ${mode === 'local' ? 'bg-white/3 border-b-4' : ' border-white/30'}`}
					onClick={() => setMode('local')}
				>
					<Monitor className="w-8" strokeWidth={1.5} />
					<span className={`text-2xl md:text-3xl text-nowrap uppercase ${unicaOne.className}`}>{t("lobby.local")}</span>
				</button>
			</div>
			<div className="flex flex-col *:transition-all *:duration-250 lg:flex-row py-5 max-w-[1000px] gap-4 w-full flex-1">
				<GameCard selected={type === 'pingpong'} setType={() => setType('pingpong')} >
					<Image
						src={"/design/pong.png"}
						alt={'pong'}
						fill
						className={`object-contain transition-all duration-300 ease-out lg:object-cover object-top-left opacity-90 bg-blue-800/30 ${type === 'pingpong' ? 'scale-[170%] lg:scale-[110%]' : 'scale-[160%] lg:scale-[100%]'}`}
						style={{ transformOrigin: 'left center'}}
						draggable={false}
					/>
				</GameCard>
				<GameCard selected={type === 'tictactoe'} setType={() => setType('tictactoe')} >
				<Image
						src={"/design/xo.png"}
						alt={'xo'}
						fill
						className={`object-contain transition-all duration-300 ease-out lg:object-cover opacity-90 object-top-left bg-[#EA2228] ${type === 'tictactoe' ? 'scale-[240%] lg:scale-[120%]' : 'scale-[230%] lg:scale-[110%]'}`}
						style={{ transformOrigin: 'top left'}}
						draggable={false}
					/>
				</GameCard>
			</div>
			<QueueToggleButton gameType={type} gameMode={mode} />
		</div>
	);
}

export default LobbyPanel;
