import { GameOverRemote } from "../../../components/Items/GameOver";
import Countdown from "../../../components/Items/CountDown";
import { useTranslations } from "next-intl";

const Overlay = ({ status, result, round }: { status: string, result: string | null, round: number }) => { // status: gameover wait play countdown none | result: win loss draw
    const t = useTranslations("game");

    return (
        <div className={`absolute inset-0 w-full ${status !== 'gameover' && 'pointer-events-none'} h-full`}>
            <div className={`absolute inset-0  rounded-lg transition-all duration-150 w-full h-full`}>
                {status === 'gameover' && <GameOverRemote display={result!} game="tictactoe" />}
                {status === 'countdown' && <Countdown text={`${t("ingame.round")} ${round}`} />}
            </div>
        </div>
    )
}

export default Overlay;