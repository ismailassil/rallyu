import Avatar from "@/app/(onsite)/(profile)/users/components/Avatar";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import inter from "@/app/fonts/inter";
import { AnimatePresence } from "framer-motion";
import GameTimer from "./GameTimer";
import { useEffect } from "react";

const PlayerCard = ({ side } : { side: string }) => {
    const avatar =  (
        <div className="w-[80px] h-[80px] border border-white/5 rounded-full bg-black/10">
               {/* avatar */}
        </div>
    );

    const playerInfo = (
        <h2 className={`flex flex-col ${inter.className}`}>
            <span className={`text-${side} text-xl font-bold shadow-2xl  pt-2`}>xezzuz</span>
            <span className={`text-${side} opacity-25 font-light`}>LVL15</span>
        </h2>
    );
    return (
        <div className={`flex flex-row ${side === 'right' ? 'justify-end' : ''} gap-6 shadow-xl border border-neutral-700/50 bg-neutral-900/50 rounded-lg p-2 w-[400px] min-w-0`}>
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


    return (
        <div className="flex h-35 w-full justify-between items-center px-10 pb-2 gap-6">
            <AnimatePresence>
                <PlayerCard side='left'/>
            </AnimatePresence>
            <GameTimer />
            <AnimatePresence>
                <PlayerCard side='right'/>
            </AnimatePresence>
        </div>
    );
}

export default VersusCard;