import Avatar from "@/app/(onsite)/users/components/Avatar";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import inter from "@/app/fonts/inter";
import GameTimer from "./GameTimer";
import { useEffect, useRef, useState } from "react";
import { Flag, Unplug } from "lucide-react";
import { AnimatePresence, motion } from 'framer-motion'
import smoochSans from "@/app/fonts/smosh";
import { VersusCardProps } from "../../types/types";
import TurnIndicator from "./TurnIndicator";
import { useTranslations } from "next-intl";

interface PlayerInfo {
    username: string,
    avatar_url: string,
    rank: number,
    level: number
}

const PlayerCard = ({ side, info, disconnect } : { side: string, info: PlayerInfo | null, disconnect?: boolean }) => {
    const t = useTranslations("game");
    
    const avatar =  (
        <div className="hidden md:flex sm:w-[60px] sm:h-[60px] md:w-[80px] md:h-[80px] xl:w-[100px] xl:h-[100px] border border-white/18 rounded-lg">
            {
            info
                ? <Avatar avatar={info.avatar_url} className="h-full w-full rounded-lg" />
                : <div className="w-full h-full bg-card animate-pulse"></div>
            }
        </div>
    );

    const playerInfo = (
        <div className={`flex w-auto h-full ${inter.className}`}>
            {
                info
                    ? 
                    <div className={`flex flex-col justify-between h-full gap-1  ${side === 'right' ? 'items-end' : 'items-start' }`}>
                        <span className={`text-${side} md:text-lg lg:text-xl xl:text-3xl font-bold shadow-2xl`}>{info?.username}</span>
                        <span className={`inline-flex flex-none text-xs xl:text-base whitespace-nowrap items-center justify-center px-3 text-md font-bold bg-white/90 rounded-full text-black`}>{t("ingame.rank")} {info.rank}</span>
                        <span className={`text-${side} text-xs xl:text-lg opacity-40 font-medium`}>{t("ingame.lvl")} {info?.level?.toFixed(2) || '0.00'}</span>
                    </div>
                    :
                    <div className={`flex flex-col h-full justify-between ${side === 'right' && 'items-end' } py-2`}>
                        <div className="w-[120px] h-[20px] bg-card rounded-full animate-pulse"></div>
                        <div className="w-[60px] h-[20px] bg-card rounded-full animate-pulse"></div>
                        <div className="w-[50px] h-[20px] bg-card rounded-full animate-pulse"></div>
                    </div>
            }
        </div>
    );

    return (
        <div className={`flex flex-row mb-2 items-center ${side === 'right' ? 'justify-end' : ''} gap-4 shadow-xl`}>
            {side === 'left' ? (
                <>
                    {avatar}
                    {playerInfo}
                </>
            ) : (
                <>
                    {disconnect && <Unplug className="mt-3 rotate-15 animate-pulse" />}
                    {playerInfo}
                    {avatar}
                </>
            )}
        </div>
    )
}

const ResignButton = ({ handleResign }: { handleResign?: () => void }) => {
    const [ popup, setPopup ] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const t = useTranslations("game");

    useEffect(() => {
        const handleClickOutside = (ev: PointerEvent) => {
            const node = popupRef.current;
            const targetNode = ev.target as Node | null;
            if (node && !node.contains(targetNode)) {
                setPopup(false);
            }
          };

        document.addEventListener("pointerdown", handleClickOutside);
        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
        };
    }, []);


    return (
        <motion.div
			initial={{ opacity: 0}}
			animate={{ opacity: 1}}
            exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="relative inline-block mt-1"
            ref={popupRef}
        >
            <button 
                onClick={() => setPopup(true)}
                className={`inline-flex rounded-xl cursor-pointer shadow-black/40 shadow-xl bg-red-700
                        transition-all duration-200 opacity-50 hover:opacity-80 ${popup ? 'opacity-80' : 'opacity-50'} hover:scale-103 active:scale-96 py-1 px-2 gap-1`}
            >
                <Flag className="aspect-square w-[17px]" />
                <span className="font-bold lg:inline hidden font-funnel-display">{t("ingame.resign")}</span>
            </button>

            <div
                className={`absolute py-3 px-5 gap-4 inline-flex flex-col left-1/2 -translate-x-1/2 bottom-full mb-5 border border-card bg-neutral-800 rounded-lg
                    transition-all duration-300 ease-out transform
                    ${popup
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-3 pointer-events-none"}`}
            >
                <span className="font-funnel-display font-extrabold md:text-lg lg:text-xl whitespace-nowrap">{t("ingame.resignmsg")}</span>
                <div className="inline-flex gap-4 mx-2">
                    <button 
                        className="border border-bg flex-1 py-1 transition-all duration-150 rounded-lg active:scale-95 bg-green-700 cursor-pointer font-extrabold text-xl"
                        onClick={() => {
                            if (handleResign) handleResign();
                            setPopup(false);
                        }}
                    >{t("yes")}</button>
                    <button
                        className="border border-bg flex-1 py-2 transition-all duration-150 rounded-lg active:scale-95 bg-neutral-700 cursor-pointer font-extrabold text-xl"
                        onClick={() => setPopup(false)}
                    >{t("no")}</button>
                </div>
            </div>
        </motion.div>

    );
}

const VersusCard = ({ 
    opponentId, 
    timeLeft, 
    handleResign, 
    disconnect, 
    round, 
    score, 
    resignSwitch, 
    currentPlayer, 
    playerSign, 
    overTime,
    bestof,
    timerType
} : VersusCardProps) => {
    const { apiClient, loggedInUser } = useAuth();
    const [loggedInUserInfo, setLoggedInUserInfo] = useState<PlayerInfo | null>(null);
    const [opponentInfo, setOpponentInfo] = useState<PlayerInfo | null>(null);
    const t = useTranslations("game");


    useEffect(() => {
        (async () => {
            try {
                const res = await apiClient.fetchUser(loggedInUser!.id);
                setLoggedInUserInfo({
                    username: res.user.username,
                    avatar_url: res.user.avatar_url,
                    rank: res.userRecords.rank,
                    level: res.userRecords.level
                })
            } catch (err) {
                console.log('unable to fetch user data: ', err);
            }
        })()
    }, []);

    useEffect(() => {
        (async () => {
            if (!opponentId) return;
            try {
                const res = await apiClient.fetchUser(opponentId);
                setOpponentInfo({
                    username: res.user.username,
                    avatar_url: res.user.avatar_url,
                    rank: res.userRecords.rank,
                    level: res.userRecords.level
                })
            } catch (err) {
                console.log('unable to fetch opponent data: ', err);
            }
        })()
    }, [opponentId]);

    return (
        <div className="flex min-h-0 w-full justify-between">
            <div className="flex w-full min-w-0 gap-3 justify-start items-center">
                <PlayerCard side='left' info={loggedInUserInfo} />
                <div className="flex h-full w-auto flex-col py-1 justify-between">
                    <AnimatePresence>
                        {resignSwitch && <ResignButton handleResign={handleResign} />}
                    </AnimatePresence>
                </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
                <div className="flex h-full w-auto flex-col py-2 justify-end items-center">
                    {score && <span className={`${smoochSans.className} text-3xl mx-3 sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold font-funnel-display text-center truncate`}>
                        {score[0]}
                    </span>}
                    {playerSign && <TurnIndicator indicator={playerSign!} currentPlayer={currentPlayer!} />}
                </div>

                <div className={`flex flex-col ${round ? 'justify-between py-2' : 'justify-end'} items-center h-full shrink-0`}>
                    {overTime && <span className="text-sm lg:text-md xl:text-lg text-red-600 font-funnel-display font-bold uppercase">{t("ingame.overtime")}</span>}
                    {bestof && <span className="text-md lg:text-lg xl:text-xl font-funnel-display font-extrabold italic">{t("ingame.bestof")} {bestof}</span>}
                    {round && <span className="text-md lg:text-lg xl:text-xl font-funnel-display font-extrabold italic">{t("ingame.round")} {round}</span>}
                    <GameTimer time={timeLeft} type={timerType} className={`${round && 'rounded-2xl'}`} />
                </div>
                <div className="flex h-full w-auto flex-col py-2 justify-end items-center">
                    
                    {score && <span className={`${smoochSans.className} self-center mx-3 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold font-funnel-display text-center truncate`}>
                        {score[1]}
                    </span>}
                    {playerSign && <TurnIndicator indicator={playerSign === 'X' ? 'O' : 'X'} currentPlayer={currentPlayer!} />}
                </div>
            </div>
            
            <div className="flex w-full min-w-0 justify-end items-center">
                <PlayerCard side='right' info={opponentInfo} disconnect={disconnect}/>
            </div>
        </div>
    );
}

export default VersusCard;