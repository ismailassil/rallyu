import Avatar from "@/app/(onsite)/users/components/Avatar";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import inter from "@/app/fonts/inter";
import { AnimatePresence } from "framer-motion";
import GameTimer from "./GameTimer";
import { useEffect, useState } from "react";
import { useGame } from "../../contexts/gameContext";

interface PlayerInfo {
    username: string,
    avatar_url: string,
    rank: number,
    level: number
}

const PlayerCard = ({ side, info } : { side: string, info: PlayerInfo | null }) => {
    const avatar =  (
        <div className="w-[80px] h-[80px] border border-white/5 rounded-full bg-black/10">
            {
            info
                ? <Avatar avatar={info.avatar_url} className="h-full w-full" />
                : <div className="w-full h-full bg-card rounded-full animate-pulse"></div>
            }
        </div>
    );

    const playerInfo = (
        <h2 className={`flex flex-col my-4 ${inter.className}`}>
            {
                info
                    ? 
                    <>
                        <span className={`text-${side} text-xl font-bold shadow-2xl`}>{info?.username}</span>
                        <span className={`text-${side} opacity-25 font-light`}>LVL {info?.level}</span>
                    </>
                    :
                    <div className="flex flex-col justify-end items-end gap-3">
                        <div className="w-[120px] h-[20px] bg-card rounded-full animate-pulse"></div>
                        <div className="w-[50px] h-[20px] bg-card rounded-full animate-pulse"></div>
                    </div>
            }
        </h2>
    );
    return (
        <div className={`flex flex-row ${side === 'right' ? 'justify-end' : ''} gap-6 shadow-xl border border-neutral-700/50 bg-neutral-900/50 rounded-full p-2`}>
            {side === 'left' ? (
                <>
                    {avatar}
                    {playerInfo}
                </>
            ) : (
                <>
                    {playerInfo}
                    {avatar}
                </>
            )}
        </div>
    )
}

const VersusCard = () => {
    const { gameState } = useGame();
    const { apiClient, loggedInUser } = useAuth();
    const [loggedInUserInfo, setLoggedInUserInfo] = useState<PlayerInfo | null>(null);
    const [opponentInfo, setOpponentInfo] = useState<PlayerInfo | null>(null);

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
            if (gameState.opponentId === null) return;
            try {
                const res = await apiClient.fetchUser(gameState.opponentId);
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
    }, [gameState.opponentId]);

    return (
        <div className="flex h-35 w-full justify-between items-center px-10 pb-2 gap-6">
            
            <AnimatePresence>
                <div className="w-[400px] min-w-0">
                    <PlayerCard side='left' info={loggedInUserInfo} />
                </div>
            </AnimatePresence>
            <GameTimer />
            <AnimatePresence>
                <div className={`w-[400px] min-w-0 transition-all duration-500 ease-out
                    ${gameState.gameStarted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}
                `}>
                    <PlayerCard side='right' info={opponentInfo} />
                </div>
            </AnimatePresence>
        </div>
    );
}

export default VersusCard;