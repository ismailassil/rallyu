import Countdown from "../../../components/Items/CountDown";
import { GameOverLocal } from "../../../components/Items/GameOver";

const Overlay = ({ status, result, round, resetHandler }: { status: string, result: string | null, round: number, resetHandler: () => void }) => { // status: pause countdown none gameover
    return (
        <div className={`absolute inset-0 w-full ${status !== 'gameover' && 'pointer-events-none'} h-full`}>
            <div className={`absolute inset-0 rounded-lg transition-all duration-150`}>
                {status === 'gameover' && <GameOverLocal resetHandler={resetHandler} display={result!} />}
                {status === 'countdown' && <Countdown round={round} />}
            </div>
        </div>
    )
}

export default Overlay;