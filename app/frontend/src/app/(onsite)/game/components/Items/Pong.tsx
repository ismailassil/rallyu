import { useRouter } from "next/navigation";

const Pong = () => {
    const router = useRouter();

    const handleClick = async () => {
        router.push('/game/pingpong/local');
    }

    return (
        <div
        className="absolute inset-0 flex items-center rounded-xl transition-all duration-150 border shadow-xl border-card bg-neutral-900/70 hover:bg-neutral-900 hover:scale-[101%] active:scale-[99%] cursor-pointer [clip-path:polygon(55%_0,100%_0,100%_100%,45%_100%)] group"
        onClick={handleClick}
        >
            <div className="absolute flex flex-col justify-end items-center right-3/11 max-w-[400px] min-w-0 min-h-0 max-h-[200px] translate-x-1/2 ">
                <span
                    className="flex justify-center items-end sm:pr-2 sm:pb-2 w-full h-[60px] text-xs sm:text-sm md:text-md lg:text-lg 2xl:text-xl whitespace-nowrap"
                    style={{
                        fontFamily: 'Serious2b'
                    }}
                >
                        Local Play
                </span>
                <span
                    className="uppercase pl-2 pt-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl 4xl:text-9xl whitespace-nowrap"
                    style={{
                        fontFamily: 'Serious2b'
                    }}
                >
                        pong
                </span>
            </div>
            <div className="absolute top-1/5 right-3 h-[15%] bg-white w-[10px] group-hover:translate-y-[265%] transition-transform duration-600 ease-in-out delay-400 group-hover:delay-0" />
        </div>
    )
}

export default Pong;