import useMatchmaking from "@/app/hooks/useMatchMaking";
import { ArrowLeft, Plus, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

const Overlay = ({ status }: { status: string }) => { // status: pause countdown empty gameover
    const router = useRouter();
    const { queueTime, isSearching, toggleSearch } = useMatchmaking('pingpong');

    const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

    return (
        <div className="absolute inset-0 w-full h-full">
            <div className={`absolute inset-0 rounded-lg transition-all duration-150 w-full h-full ${status === 'gameover' ? 'bg-neutral-800/30 ': ''}`}>
                <div className={`absolute inset-0 m-auto p-3 flex flex-col justify-between w-[clamp(170px,20%,100%)] h-[clamp(100px,20%,100%)] border border-card bg-neutral-900 shadow-black shadow-2xl rounded-lg transition-all duration-300 ease-in-out ${status === 'gameover' ? 'opacity-100 translate-y-0': 'translate-y-20 opacity-0'}`}>
                    <span className='flex flex-1 text-4xl whitespace-nowrap mb-5 font-funnel-display font-bold justify-center items-center'>You {status}</span>
                    <div className="inline-flex gap-2 ">
                        <button
                            onClick={() => router.push('/game')}
                            className="inline-flex flex-1 justify-center py-4 items-center gap-1 rounded-lg bg-neutral-800 shadow-black/40 shadow-xl transition-all duration-200 hover:cursor-pointer hover:scale-102 active:scale-99"
                        >
                            <ArrowLeft className="w-[20px] h-[20px]"/>
                            <span className="text-xl font-extrabold font-funnel-display">Lobby</span>
                        </button>
                        <button
                            onClick={toggleSearch}
                            className={`inline-flex flex-1 justify-center py-4 items-center gap-1 rounded-lg bg-green-800 shadow-black/40 shadow-xl transition-all duration-200 hover:cursor-pointer hover:scale-102 active:scale-99 ${isSearching ? 'animate-pulse' : ''}`}
                        >
                            <Plus className={`w-5 h-5 transition-all duration-300 ${isSearching && 'rotate-45'}`}/>
                            <span className={`inline-flex text-xl font-extrabold text-nowrap font-funnel-display ${isSearching && 'scale-105'}`}>
                                { isSearching
                                    ? `In Queue... ${formatTime(queueTime)}`
                                    : 'New Match'
                                }
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// <div className="absolute inset-0 w-full h-full flex items-center justify-center p-4">
        //     <div className={`absolute inset-0 rounded-lg transition-all duration-150 ${status === 'gameover' ? 'bg-neutral-800/30' : ''}`}>
        //         <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[400px] min-w-[280px] p-4 sm:p-6 flex flex-col justify-between border border-card bg-neutral-900 shadow-black shadow-2xl rounded-lg transition-all duration-300 ease-in-out ${status === 'gameover' ? 'opacity-100 scale-100' : 'scale-95 opacity-0'}`}>
        //             <div className="flex-1 flex items-center justify-center mb-4 sm:mb-6">
        //                 <span className='font-funnel-display text-[clamp(1.2rem,4vw,2rem)] sm:text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-center'>
        //                     You {status}
        //                 </span>
        //             </div>
        //             <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
        //                 <button
        //                     onClick={() => router.push('/game')}
        //                     className="flex-1 flex justify-center items-center gap-2 py-3 sm:py-4 px-4 rounded-lg bg-neutral-800 shadow-black/40 shadow-xl transition-all duration-200 hover:cursor-pointer hover:scale-102 active:scale-99 min-h-[50px] sm:min-h-[60px]"
        //                 >
        //                     <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        //                     <span className="text-base sm:text-lg font-extrabold font-funnel-display">Lobby</span>
        //                 </button>
        //                 <button
        //                     onClick={toggleSearch}
        //                     className={`flex-1 flex justify-center items-center gap-2 py-3 sm:py-4 px-4 rounded-lg bg-green-800 shadow-black/40 shadow-xl transition-all duration-200 hover:cursor-pointer hover:scale-102 active:scale-99 min-h-[50px] sm:min-h-[60px] ${isSearching ? 'animate-pulse' : ''}`}
        //                 >
        //                     <Plus className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${isSearching && 'rotate-45'}`}/>
        //                     <span className={`text-base sm:text-lg font-extrabold font-funnel-display transition-all duration-150 text-center whitespace-nowrap ${isSearching && 'scale-105'} `}>
        //                         {isSearching
        //                             ? `Queue ${formatTime(queueTime)}`
        //                             : 'New Match'
        //                         }
        //                     </span>
        //                 </button>
        //             </div>
        //         </div>
        //     </div>
        // </div>

export default Overlay;