import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useState } from "react";
import MatchTimer from "./MatchTimer";
import unicaOne from "@/app/fonts/unicaOne";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

let pollingGame: NodeJS.Timeout | null = null;

const FooterGoing = function (
    { readyProp, joined, startTime, waiting, matchId, tournamentMode, matchRoom } :
    { readyProp: boolean, joined: boolean, startTime: string | null, waiting: boolean, matchId: number, tournamentMode: string, matchRoom: boolean }
) {
    const [ready, setReady] = useState<boolean>(readyProp);
    const { apiClient } = useAuth();
    const [timeRunsOut, setTimeRunsOut] = useState<boolean>(true);
    const router = useRouter();
    const [error, setError] = useState({ status: false, message: "" })
    const translate = useTranslations("tournament")

    const playerReadyHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (timeRunsOut || matchRoom)
            return ;

        try {
            await apiClient.instance.patch(`/v1/tournament/match/ready`, { matchId: matchId });
            
            setReady(!ready);

            if (!pollingGame) {

                pollingGame = setInterval(async () => {
                    try {
                        const res = await apiClient.instance.get(`/v1/tournament/match/match_id?match_id=${matchId}`);
                        
                        const data = res.data;

                        if (!data || !data.match_id.match_id)
                            return ;

                        // HOW TO SEND THE PAGE BACK
                        router.replace(`/game/${tournamentMode === "ping-pong" ? "pingpong" : "tictactoe"}/${data.match_id.match_id}`);
                        if (pollingGame)
                            clearInterval(pollingGame);
                        pollingGame = null;
                        
                    } catch (err) {
                        console.error(err);
                    }
                    
                }, 1000 * 2);

            } else {
                clearInterval(pollingGame);
                pollingGame = null;
            }

            setError({ status: false, message: "" })

        } catch (err: any) {
            if (pollingGame)
                clearInterval(pollingGame);
            pollingGame = null;
            
            if (err.status === 400)
                setError({ status: true, message: translate("bracket.progress.error-play")  });
            else 
                setError({ status: true, message: translate("bracket.progress.error") });

        }
    };

    return (
        <div className="flex flex-col gap-5">
            { joined &&
                <>
                
                    <div className="flex flex-wrap items-center justify-between">
                        <p className="text-gray-300">
                            {
                                !waiting && (!timeRunsOut ?
                                    `${translate("bracket.progress.ready")} ⌛`
                                    :
                                    `${translate("bracket.progress.loss")} 👾`)
                            }
                            {
                                waiting &&
                                    `${translate("bracket.progress.win")} 🎉`
                            }
                        </p>
                        <MatchTimer startTime={startTime} timeRunsOut={timeRunsOut} setTimeRunsOut={setTimeRunsOut} />
                    </div>
                    { error.status && <p className="text-red-400">{ error.message }</p> }
                    <>
                        {
                            !waiting && (!timeRunsOut ? (!ready ?
                            <button 
                                className="bg-yellow-600 hover:scale-102 py-3 px-24
                                                cursor-pointer
                                                rounded-lg text-sm
                                                transition-all duration-300
                                                self-stretch sm:self-center"
                                onClick={playerReadyHandler}
                            >
                                {translate("bracket.progress.buttons.ready")}
                            </button> :
                            <button 
                                className="bg-card outline-white/20 outline-1 hover:scale-102 py-3 px-24
                                                cursor-pointer
                                                rounded-lg text-sm
                                                transition-all duration-300
                                                self-stretch sm:self-center"
                                onClick={playerReadyHandler}
                            >
                                {translate("bracket.progress.buttons.cancel")}
                            </button>) :
                             <div 
                                className="bg-purple-700 py-3 px-24
                                                rounded-lg text-sm
                                                self-stretch sm:self-center text-center"
                            >
                                <p>{translate("bracket.progress.buttons.game-over")}</p>
                            </div>)

                        }
                        {
                            waiting &&
                                <div 
                                    className={`${unicaOne.className}
                                                rounded-lg text-xl
                                                self-stretch sm:self-center`}
                                >
                                    <p className="text-yellow-400">{translate("bracket.progress.buttons.waiting")}</p>
                                </div>
                        }
                    </>
                </>
            }
            {
                !joined &&
                <>
                    <div className="flex flex-wrap items-center justify-between">
                        <p className="text-gray-300">
                            {translate("bracket.progress.buttons.spectate")} &#128064;
                        </p>
                    </div> 
                </> 
            }
        </div>
    );
};

export default FooterGoing;