import { ArrowLeft, Pause, Play, RotateCcw, Undo } from "lucide-react";
import { useRouter } from "next/navigation";

const PauseIcon = ({ className }: { className: string }) => {
    return (
        <div className={`flex justify-between gap-[28%] ${className}`}>
            <div className="flex-1 bg-white rounded-sm"></div>
            <div className="flex-1 bg-white rounded-sm"></div>
        </div>
    )
}

const Overlay = ({ undoHandler, resetHandler, status }: { undoHandler: () => void, resetHandler: () => void, status: string }) => { // status: pause countdown none gameover
    const router = useRouter();


    return (
        <div className="absolute inset-0 w-full h-full">
            <div className={`absolute inset-0 rounded-lg transition-all duration-150 w-full h-full ${status === 'pause' || status === 'gameover' ? 'bg-neutral-800/30 ': ''}`}>
                <PauseIcon className={`absolute inset-0 m-auto w-[clamp(50px,8%,100%)] h-[clamp(65px,15%,100%)] transition-all duration-100 ease-in-out ${status === 'pause' ? 'opacity-90 translate-y-0': 'translate-y-4 opacity-0'}`}/>
                <div className={`absolute inset-0 m-auto p-3 flex flex-col justify-between w-[clamp(120px,20%,100%)] h-[clamp(70px,20%,100%)] border border-card bg-neutral-900 shadow-black shadow-2xl rounded-lg transition-all duration-300 ease-in-out ${status === 'gameover' ? 'opacity-100 translate-y-0': 'translate-y-20 opacity-0'}`}>
                    <span className='flex flex-1 text-4xl font-funnel-display pb-5 font-bold justify-center items-center'>Player1 Wins</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => router.push('/game')}
                            className="inline-flex flex-1 justify-center py-4 items-center gap-2 rounded-lg text-xl font-extrabold font-funnel-display bg-neutral-800 shadow-black/40 shadow-xl transition-all duration-200 hover:cursor-pointer hover:scale-102 active:scale-99"
                        >
                            <ArrowLeft className="w-[20px] h-[20px]" />
                            Lobby
                        </button>
                        <button
                            onClick={resetHandler}
                            className="inline-flex flex-1 justify-center py-4 items-center gap-2 rounded-lg text-xl font-extrabold font-funnel-display bg-green-800 shadow-black/40 shadow-xl transition-all duration-200 hover:cursor-pointer hover:scale-102 active:scale-99"
                        >
                            <RotateCcw className="w-[20px] h-[20px]" />
                            Rematch
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute flex justify-center items-center gap-3 right-8 top-5 w-[120px] h-[60px]">
                <button 
                    className="rounded-xl border cursor-pointer border-card bg-card transition-all duration-200 hover:bg-white/6 hover:opacity-80 hover:scale-103 active:scale-96 p-2 opacity-50"
                    // onClick={undoHandler}
                >
                    <Undo  className="w-[35px] h-[35px]" />
                </button>
            </div>
        </div>
    )
}

export default Overlay;