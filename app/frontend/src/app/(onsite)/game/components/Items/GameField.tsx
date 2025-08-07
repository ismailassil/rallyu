import { useGame } from "../../contexts/gameContext"
import Pong from "../pong/Pong"

const GameField = () => {
    const { gameType } = useGame();

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-[800px] border h-full">
            {/* <PlayerCard img="" name="" side="left"/> */}
            <div className="h-15 border border-red-500 w-full">

            </div>
            {/* here we should flip between pong and tictactoe */}
            <Pong />
        </div>
    )
}

export default GameField