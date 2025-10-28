import { useTranslations } from "next-intl";
import Countdown from "../../../components/Items/CountDown";
import GameOver, { GameOverRemote } from "../../../components/Items/GameOver";
import { AnimatePresence, motion } from "framer-motion";

const Overlay = ({ status, result, tournamentId }: { status: string, result: string | null, tournamentId?: number | null }) => { // status: pause countdown empty gameover
    const t = useTranslations("game");
    
    return (
        <AnimatePresence>
            <motion.div
                key="overlay"
                className={`absolute inset-0 rounded-lg transition-all duration-150 w-full h-full ${status === 'gameover' && 'bg-neutral-800/30'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                { tournamentId && result
                    ? <GameOver display={result} tournamentId={tournamentId}/>
                    : result && <GameOverRemote display={result} game="pingpong" />}
                {status === "countdown" && <Countdown text={t("ingame.start")} />}
            </motion.div>
        </AnimatePresence>
    )
}

export default Overlay;