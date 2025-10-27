import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { AxiosResponse } from "axios";
import { useState } from "react";
import MatchTimer from "./MatchTimer";
import unicaOne from "@/app/fonts/unicaOne";
import { useRouter } from "next/navigation";

let pollingGame: NodeJS.Timeout | null = null;

const FooterGoing = function (
    { readyProp, joined, startTime, waiting, matchId, tournamentMode, matchRoom } :
    { readyProp: boolean, joined: boolean, startTime: string | null, waiting: boolean, matchId: number, tournamentMode: string, matchRoom: boolean }
) {
    const [ready, setReady] = useState<boolean>(readyProp);
    const { apiClient } = useAuth();
    const [timeRunsOut, setTimeRunsOut] = useState<boolean>(true);
    const router = useRouter();

    const playerReadyHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (timeRunsOut || matchRoom)
            return ;

        try {
            const res = await apiClient.instance.patch(`/v1/tournament/match/ready`, { matchId: matchId });
            console.error(res);

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

        } catch (err: unknown) {
            if (pollingGame)
                clearInterval(pollingGame);
            pollingGame = null;
            console.error(err);
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
                                    "Don’t just sit there looking ready… Click Ready so your opponent knows too ⌛"
                                    :
                                    "Unfortunately you are out of the tournament… Good luck next time 👾")
                            }
                            {
                                waiting &&
                                    "Congrats you've won your first match... now only one match left for the trophy 🎉"
                            }
                        </p>
                        <MatchTimer startTime={startTime} timeRunsOut={timeRunsOut} setTimeRunsOut={setTimeRunsOut} />
                    </div>
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
                                I am Ready!
                            </button> :
                            <button 
                                className="bg-card outline-white/20 outline-1 hover:scale-102 py-3 px-24
                                                cursor-pointer
                                                rounded-lg text-sm
                                                transition-all duration-300
                                                self-stretch sm:self-center"
                                onClick={playerReadyHandler}
                            >
                                Cancel FAST...
                            </button>) :
                             <div 
                                className="bg-purple-700 py-3 px-24
                                                rounded-lg text-sm
                                                self-stretch sm:self-center text-center"
                            >
                                <p>Game Over</p>
                            </div>)

                        }
                        {
                            waiting &&
                                <div 
                                    className={`${unicaOne.className}
                                                rounded-lg text-xl
                                                self-stretch sm:self-center`}
                                >
                                    <p className="text-yellow-400">Waiting for opponent...</p>
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
                            You are not participating in this tournament… But you still can spectate &#128064;
                        </p>
                    </div> 
                </> 
            }
        </div>
    );
};

export default FooterGoing;