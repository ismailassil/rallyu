import { Pause, Play, RotateCcw } from "lucide-react";
import GameOver from "../../../components/Items/GameOverLocal";

const PauseIcon = ({ className }: { className: string }) => {
    return (
        <div className={`flex justify-between gap-[28%] ${className}`}>
            <div className="flex-1 bg-white rounded-sm"></div>
            <div className="flex-1 bg-white rounded-sm"></div>
        </div>
    )
}

const Overlay = ({ pauseHandler, resetHandler, status }: { pauseHandler: () => void, resetHandler: () => void, status: string }) => { // status: pause countdown none gameover
    return (
        <div className="absolute inset-0 w-full h-full">
            <div className={`absolute inset-0 rounded-lg transition-all duration-150 w-full h-full ${status === 'pause' || status === 'gameover' ? 'bg-neutral-800/30 ': ''}`}>
                {status === 'gameover' && <GameOver resetHandler={resetHandler} />}
                <PauseIcon className={`absolute inset-0 m-auto w-[clamp(50px,8%,100%)] h-[clamp(65px,15%,100%)] transition-all duration-100 ease-in-out ${status === 'pause' ? 'opacity-90 translate-y-0': 'translate-y-4 opacity-0'}`}/>
            </div>

            <div className="absolute flex justify-center items-center gap-3 right-2 top-1 md:right-4 md:top-2 lg:right-8 lg:top-5 w-[100px] h-[50px] xl:w-[120px] xl:h-[60px]">
                <button 
                    className="rounded-xl border cursor-pointer border-card bg-card transition-all duration-200 hover:bg-white/6 hover:opacity-80 hover:scale-103 active:scale-96 p-2 opacity-50"
                    onClick={pauseHandler}
                >
                    {status === 'pause' ? (
                        <Play className="w-[20px] h[20px] md:w-[25px] md:h-[25px] lg:w-[30px] lg:[h-30px] xl:w-[35px] xl:h-[35px] scale-105" />
                    ) : (
                        <Pause className="w-[20px] h[20px] md:w-[25px] md:h-[25px] lg:w-[30px] lg:[h-30px] xl:w-[35px] xl:h-[35px]" />
                    )}
                </button>

                <button 
                    className="rounded-xl  border cursor-pointer border-card bg-card transition-all duration-200 hover:bg-white/6 hover:opacity-80 hover:scale-103 active:scale-96 p-2 opacity-50"
                    onClick={resetHandler}
                >
                    <RotateCcw  className="w-[20px] h[20px] md:w-[25px] md:h-[25px] lg:w-[30px] lg:[h-30px] xl:w-[35px] xl:h-[35px]" />
                </button>
            </div>
        </div>
    )
}

export default Overlay;