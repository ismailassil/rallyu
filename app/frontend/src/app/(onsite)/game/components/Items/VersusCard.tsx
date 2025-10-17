import Avatar from "@/app/(onsite)/users/components/Avatar";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import inter from "@/app/fonts/inter";
import GameTimer from "./GameTimer";
import { useEffect, useRef, useState } from "react";
import { Flag, Unplug } from "lucide-react";

interface PlayerInfo {
    username: string,
    avatar_url: string,
    rank: number,
    level: number
}

const PlayerCard = ({ side, info, disconnect } : { side: string, info: PlayerInfo | null, disconnect?: boolean }) => {
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
        <div className={`flex min-w-[100px] ${inter.className}`}>
            {
                info
                    ? 
                    <div className={`flex flex-col justify-between  ${side === 'right' ? 'items-end' : 'items-start' }`}>
                        <span className={`text-${side} text-3xl font-bold shadow-2xl`}>{info?.username}</span>
                        <span className={`inline-flex flex-none items-center justify-center px-2 text-md font-bold bg-white/90 rounded-full text-black`}>Rank {info.rank}</span>
                        <span className={`text-${side} text-lg opacity-40 font-medium`}>LVL {info?.level}</span>
                    </div>
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
        <div ref={popupRef} className="relative inline-block mt-3">
            <button 
                onClick={() => setPopup(true)}
                className={`inline-flex rounded-xl cursor-pointer shadow-black/40 shadow-xl bg-red-700
                        transition-all duration-200 opacity-50 hover:opacity-80 ${popup ? 'opacity-80' : 'opacity-50'} hover:scale-103 active:scale-96 py-1 px-2 gap-1`}
            >
                <Flag className="aspect-square w-[17px]" />
                <span className="font-bold font-funnel-display">Resign</span>
            </button>

            <div
                className={`absolute py-3 px-5 gap-4 inline-flex flex-col left-1/2 -translate-x-1/2 bottom-full mb-5 border border-card bg-neutral-800 rounded-lg
                    transition-all duration-300 ease-out transform
                    ${popup
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-3 pointer-events-none"}`}
            >
                <span className="font-funnel-display font-extrabold text-xl whitespace-nowrap"> Are you sure you want to resign ?</span>
                <div className="inline-flex gap-4 mx-2">
                    <button 
                        className="border border-bg flex-1 py-1 transition-all duration-150 rounded-lg active:scale-95 bg-green-700 cursor-pointer font-extrabold text-xl"
                        onClick={() => {
                            if (handleResign) handleResign();
                            setPopup(false);
                        }}
                    >Yes</button>
                    <button
                        className="border border-bg flex-1 py-2 transition-all duration-150 rounded-lg active:scale-95 bg-neutral-700 cursor-pointer font-extrabold text-xl"
                        onClick={() => setPopup(false)}
                    >No</button>
                </div>
            </div>
        </div>

    );
}

const VersusCard = ({ opponentId, timeLeft, handleResign, disconnect }: { opponentId? : number | undefined, timeLeft: number, handleResign: () => void, disconnect?: boolean }) => {
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

    console.log('disconnect: ', disconnect);

    return (
        <div className="flex min-h-0 w-full max-w-[1600px] justify-between items-end">
            
            <div className="flex w-[400px] min-w-0 gap-3 items-start">
                <PlayerCard side='left' info={loggedInUserInfo} />
                <ResignButton handleResign={handleResign} />
            </div>
            
            <GameTimer time={timeLeft} pause={null} />
            <div className={`w-[400px] min-w-0`}>
                <PlayerCard side='right' info={opponentInfo} disconnect={disconnect} />
            </div>
        </div>
    );
}

export default VersusCard;