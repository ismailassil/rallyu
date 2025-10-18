import GameOver from "../../../components/Items/GameOver";

const Overlay = ({ status, result }: { status: string, result: string | null }) => { // status: pause countdown empty gameover
    return (
        <div className="absolute inset-0 w-full h-full">
            <div className={`absolute inset-0 rounded-lg transition-all duration-150 w-full h-full ${status !== 'none' && 'bg-neutral-800/30'}`}>
                {result && <GameOver display={result} game={'pingpong'} />}
            </div>
        </div>
    )
}

export default Overlay;