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

    const rank = (
        <div className={`flex min-w-[60px] h-[30px] self-center border border-black/5 ${side === 'left' ? 'ml-auto mr-6' : 'mr-auto ml-6'} `}>
            {
            info
                ? <div className={`flex items-center justify-center text-lg w-full h-full font-bold bg-white/90 rounded-full text-black`}>#{info.rank}</div>
                : <div className="w-full h-full rounded-full bg-white/90 bg- animate-pulse"></div>
            }
        </div>
    )

    return (
        <div className={`flex flex-row ${side === 'right' ? 'justify-end' : ''} gap-6 shadow-xl border border-neutral-700/50 bg-neutral-900/50 rounded-full p-2`}>
            {side === 'left' ? (
                <>
                    {avatar}
                    {playerInfo}
                    {rank}
                </>
            ) : (
                <>
                    {rank}
                    {playerInfo}
                    {avatar}
                </>
            )}
        </div>
    )
}

const VersusCard = ({ opponentId }: { opponentId? : number | undefined }) => {
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
        <div className="flex h-35 w-full max-w-[2000px] justify-between items-center px-10 pb-2 gap-6">
            <div className="w-[400px] min-w-0">
                <PlayerCard side='left' info={loggedInUserInfo} />
            </div>
            <GameTimer />
            <div className={`w-[400px] min-w-0`}>
                <PlayerCard side='right' info={opponentInfo} />
            </div>
        </div>
    );
}

export default VersusCard;