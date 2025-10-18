import useMatchmaking from "@/app/hooks/useMatchMaking";

const MovingText = ({ dir }: { dir: 'left' | 'right' }) => {
    const loadingText = ' finding match ';

    return (
        <div className="overflow-hidden whitespace-nowrap py-4">
            <style>{`
                @keyframes scrollLeft {
                    from { transform: translateX(11%); }
                    to { transform: translateX(-88%); }
                }
                
                @keyframes scrollRight {
                    from { transform: translateX(-99%); }
                    to { transform: translateX(0); }
                }
                
                .animate-scroll-left {
                    animation: scrollLeft 70s linear infinite;
                }
                
                .animate-scroll-right {
                    animation: scrollRight 70s linear infinite;
                }
            `}</style>
            <div className={`inline-flex ${dir === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'}`}>
                <span className="uppercase text:sm md:text-lg lg:text-2xl" style={{fontFamily: 'Serious2b'}}>{loadingText.repeat(15)}&nbsp;</span>
                <span className="uppercase text:sm md:text-lg lg:text-2xl" style={{fontFamily: 'Serious2b'}}>{loadingText.repeat(15)}&nbsp;</span>
            </div>
        </div>
    )
}

const Ping = () => {
    const { queueTime, isSearching, toggleSearch } = useMatchmaking('pingpong');

    const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

    return (
        <div
        className="absolute inset-0 flex items-center rounded-xl transition-all duration-150 border shadow-xl border-card bg-neutral-900/70 hover:bg-neutral-900 hover:scale-[101%] active:scale-[99%] cursor-pointer [clip-path:polygon(0_0,55%_0,45%_100%,0_100%)] group"
        onClick={toggleSearch}
        >
            <div className="absolute flex flex-col items-center left-3/11 max-w-[400px] min-w-0 min-h-0 max-h-[200px] -translate-x-1/2 ">
                <span
                    className="uppercase pl-2 pt-2 tracking-widest text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl 4xl:text-9xl whitespace-nowrap"
                    style={{
                        fontFamily: 'Serious2b'
                    }}
                >
                        ping
                </span>
                <span
                    className={`flex justify-center sm:pl-2 sm:pt-2 w-full h-[60px] text-xs sm:text-sm md:text-md lg:text-lg 2xl:text-xl whitespace-nowrap
                    ${isSearching 
                        ? "scale-100 cursor-pointer pl-6 transition-transform duration-200"
                        : "scale-105 cursor-pointer pl-6 transition-transform duration-200"
                    }`}
                    style={{
                        fontFamily: 'Serious2b'
                    }}
                >
                        {isSearching ? `In Queue ${formatTime(queueTime)}` :'remote play'}
                </span>
            </div>
            <div className="absolute top-3/5 left-3 h-[15%] bg-white w-[10px] group-hover:-translate-y-50 transition-transform duration-600 ease-in-out delay-400 group-hover:delay-0" />
        </div>
    )
}

export default Ping;