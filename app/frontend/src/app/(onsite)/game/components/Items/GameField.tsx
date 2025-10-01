import { useGame } from "../../contexts/gameContext"
import Pong from "../pong/Pong"
import VersusCard from "./VersusCard";

const GameField = () => {
    const { gameType } = useGame();

    return (
        <div className="flex flex-col justify-center items-center w-full flex-1 min-h-0">
            {/* <PlayerCard img="" name="" side="left"/> */}
            <VersusCard />
            {/* here we should flip between pong and tictactoe */}
            <div className="flex-1 flex items-center justify-center min-h-0 w-full">
                <Pong />
            </div>        
        </div>
    )
}

export default GameField