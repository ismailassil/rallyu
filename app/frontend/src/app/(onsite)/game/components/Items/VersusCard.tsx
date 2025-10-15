import Avatar from "@/app/(onsite)/users/components/Avatar";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import inter from "@/app/fonts/inter";
import GameTimer from "./GameTimer";
import { useEffect, useState } from "react";

interface PlayerInfo {
    username: string,
    avatar_url: string,
    rank: number,
    level: number
}

const PlayerCard = ({ side, info } : { side: string, info: PlayerInfo | null }) => {
    const avatar =  (
        <div className="w-[100px] h-[100px] border border-white/18 rounded-lg">
            {
            info
                ? <Avatar avatar={info.avatar_url} className="h-full w-full rounded-lg" />
                : <div className="w-full h-full bg-card animate-pulse"></div>
            }
        </div>
    );

    const playerInfo = (
        <div className={`flex flex-col justify-between items-start min-w-[100px] ${inter.className}`}>
            {
                info
                    ? 
                    <>
                        <span className={`text-${side} text-3xl font-bold shadow-2xl`}>{info?.username}</span>
                        <span className={`inline-flex flex-none items-center justify-center px-2 text-md font-bold bg-white/90 rounded-full text-black`}>Rank {info.rank}</span>
                        <span className={`text-${side} text-lg opacity-40 font-medium`}>LVL {info?.level}</span>
                    </>
                    :
                    <div className={`flex flex-col ${side === 'right' && 'justify-end items-end' } pt-2  gap-3`}>
                        <div className="w-[120px] h-[20px] bg-card rounded-full animate-pulse"></div>
                        <div className="w-[60px] h-[20px] bg-card rounded-full animate-pulse"></div>
                        <div className="w-[50px] h-[20px] bg-card rounded-full animate-pulse"></div>
                    </div>
            }
        </div>
    );

    return (
        <div className={`flex flex-row ${side === 'right' ? 'justify-end' : ''} gap-4 shadow-xl py-2`}>
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

const VersusCard = ({ opponentId, timeLeft }: { opponentId? : number | undefined, timeLeft: number }) => {
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
        <div className="flex min-h-0 w-full max-w-[1600px] justify-between items-end">
            <div className="w-[400px] min-w-0">
                <PlayerCard side='left' info={loggedInUserInfo} />
            </div>
            <GameTimer time={timeLeft} pause={null} />
            <div className={`w-[400px] min-w-0`}>
                <PlayerCard side='right' info={opponentInfo} />
            </div>
        </div>
    );
}

export default VersusCard;