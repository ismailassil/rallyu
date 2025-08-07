import { motion } from "framer-motion";
import { useGame } from "../../contexts/gameContext"
import Pong from "../pong/Pong"
import Versus from "./Versus";

const GameField = () => {
    const { gameType } = useGame();

    return (
        <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1 }}
                className={`flex flex-col justify-center items-center w-full h-full  rounded-md`}
            >
                <Versus />
                {/* <PlayerCard img="" name="" side="left"/> */}
                {/* here we should flip between pong and tictactoe */}
                <Pong />

        </motion.div>
    )
}

export default GameField