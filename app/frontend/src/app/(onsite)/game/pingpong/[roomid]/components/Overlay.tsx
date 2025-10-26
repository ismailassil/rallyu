import { useTranslations } from "next-intl";
import Countdown from "../../../components/Items/CountDown";
import { GameOverRemote } from "../../../components/Items/GameOver";

const Overlay = ({ status, result }: { status: string, result: string | null }) => { // status: pause countdown empty gameover
    const t = useTranslations("game");
    
    return (
        <div className="absolute inset-0 w-full h-full">
            <div className={`absolute inset-0 rounded-lg transition-all duration-150 w-full h-full ${status !== 'none' && 'bg-neutral-800/30'}`}>
                {result && <GameOverRemote display={result} game={'pingpong'} />}
                {status === 'countdown' && <Countdown text={`${t("ingame.start")}`} />}
            </div>
        </div>
    )
}

export default Overlay;