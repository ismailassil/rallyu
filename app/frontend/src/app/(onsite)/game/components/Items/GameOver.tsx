import useMatchmaking from "@/app/hooks/useMatchMaking";
import { GameType } from "../../types/types";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";

const GameOver = ({ display, game }: { display: string, game: GameType }) => {
    const router = useRouter();
    const { queueTime, isSearching, toggleSearch } = useMatchmaking(game);

    const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

    return (
        <div className={`absolute inset-0 m-auto flex flex-col lg:w-[300px] md:w-[250px] w-[230px] aspect-video justify-between border border-card bg-neutral-900 shadow-black shadow-2xl rounded-lg transition-all duration-300 ease-in-out`}>
            <span className='flex bg-amber-950/3 pt-3 rounded-t-lg flex-1 text-2xl md:text-3xl lg:text-4xl whitespace-nowrap mb-5 font-funnel-display font-bold justify-center items-center'>
                {display}
            </span>
            <div className="flex p-3 gap-2 ">
                <button
                    onClick={() => router.push('/game')}
                    className="flex w-full justify-center py-4 items-center gap-1 rounded-lg bg-neutral-800 shadow-black/40 shadow-xl transition-all duration-200 hover:cursor-pointer hover:scale-102 active:scale-99"
                >
                    <ArrowLeft className="w-[20px] h-[20px]"/>
                    <span className="text-md md:text-lg lg:text-xl font-bold font-funnel-display">Lobby</span>
                </button>
                <button
                    onClick={toggleSearch}
                    className={`flex w-full justify-center py-4 items-center gap-1 rounded-lg bg-green-800 shadow-black/40 shadow-xl transition-all duration-200 hover:cursor-pointer hover:scale-102 active:scale-99 ${isSearching ? 'animate-pulse' : ''}`}
                >
                    <Plus className={`w-5 h-5 transition-all duration-300 ${isSearching && 'rotate-45'}`}/>
                    <span className={`text-sm md:text-md lg:text-lg font-bold text-nowrap font-funnel-display ${isSearching && 'scale-105'}`}>
                        { isSearching
                            ? `${formatTime(queueTime)}`
                            : 'Play Again'
                        }
                    </span>
                </button>
            </div>
        </div>
    )
}

export default GameOver