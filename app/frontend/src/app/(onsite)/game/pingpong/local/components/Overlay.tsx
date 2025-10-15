import { Pause, Play, RotateCcw } from "lucide-react";

const Overlay = ({ pauseHandler, resetHandler, status }: { pauseHandler: () => void, resetHandler: () => void, status: string }) => {

    return (
        <div className="absolute inset-0 border w-full h-full">
            
            <div className="absolute flex justify-center items-center gap-3 right-8 top-5 w-[120px] h-[60px]">

                <button 
                    className="rounded-xl border cursor-pointer border-card bg-card transition-all duration-200 hover:bg-white/6 hover:opacity-80 hover:scale-103 active:scale-96 p-2 opacity-50"
                    onClick={pauseHandler}
                >
                    {status === 'pause' ? (
                        <Play className="w-[35px] h-[35px] scale-105" />
                    ) : (
                        <Pause className="w-[35px] h-[35px]" />
                    )}
                </button>

                <button 
                    className="rounded-xl border cursor-pointer border-card bg-card transition-all duration-200 hover:bg-white/6 hover:opacity-80 hover:scale-103 active:scale-96 p-2 opacity-50"
                    onClick={resetHandler}
                >
                    <RotateCcw  className="w-[35px] h-[35px]" />
                </button>
            </div>
        </div>
    )
}

export default Overlay;