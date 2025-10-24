import useMatchmaking from "@/app/hooks/useMatchMaking";
import { GameType } from "../../types/types";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";

const GameOver = ({ display, children }: { display: string, children: ReactNode }) => {
    const router = useRouter();
    const t = useTranslations("game");

    return (
        <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{
                duration: 0.45,
                opacity: { duration: 0.6 },
                ease: 'easeOut',
            }}
            className={`absolute inset-0 m-auto flex flex-col lg:w-[300px] md:w-[250px] w-[230px] aspect-video border border-card bg-neutral-900 shadow-black shadow-2xl rounded-lg`}
        >
            <span className='flex flex-1 bg-amber-950/3 pt-3 rounded-t-l text-3xl lg:text-4xl whitespace-nowrap font-funnel-display font-bold justify-center items-center'>
                {t("gameover.display", {text: display})}
            </span>
            <div className="flex p-3 gap-2 ">
                <button
                    onClick={() => router.push('/game')}
                    className="flex w-full justify-center py-4 items-center gap-1 rounded-lg bg-neutral-800 shadow-black/40 shadow-xl transition-all duration-200 hover:cursor-pointer hover:scale-102 active:scale-99"
                >
                    <ArrowLeft className="w-[20px] h-[20px]"/>
                    <span className="text-md md:text-lg lg:text-xl font-bold font-funnel-display">{t("buttons.lobby")}</span>
                </button>
                {children}
            </div>
        </motion.div>
    )
}

export const GameOverLocal = ({ resetHandler, display }: { resetHandler: () => void, display: string }) => {
    const t = useTranslations("game");

    return (
        <GameOver display={display} >
            <button
                onClick={resetHandler}
                className={`flex w-full justify-center py-4 items-center gap-1 rounded-lg bg-green-800 shadow-black/40 shadow-xl transition-all duration-200 hover:cursor-pointer hover:scale-102 active:scale-99`}
            >
                <RotateCcw className={`w-5 h-5 transition-all duration-300 `}/>
                <span className={`text-sm md:text-md lg:text-lg font-bold text-nowrap font-funnel-display`}>
                    {t("buttons.rematch")}
                </span>
            </button>
        </GameOver>
    )
}

export const GameOverRemote = ({ display, game }: { display: string, game: GameType }) => {
    const { queueTime, isSearching, toggleSearch } = useMatchmaking(game);
    const t = useTranslations("game");

    const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

    return (
        <GameOver display={display} >
            <button
                onClick={toggleSearch}
                className={`flex w-full justify-center py-4 items-center gap-1 rounded-lg bg-green-800 shadow-black/40 shadow-xl transition-all duration-200 hover:cursor-pointer hover:scale-102 active:scale-99 ${isSearching ? 'animate-pulse' : ''}`}
            >
                <Plus className={`w-5 h-5 transition-all duration-300 ${isSearching && 'rotate-45'}`}/>
                <span className={`text-sm md:text-md lg:text-lg font-bold text-nowrap font-funnel-display ${isSearching && 'scale-105'}`}>
                    {isSearching ? `${formatTime(queueTime)}` : `${t("buttons.play_again")}`}
                </span>
            </button>
        </GameOver>
    )
}


export default GameOver