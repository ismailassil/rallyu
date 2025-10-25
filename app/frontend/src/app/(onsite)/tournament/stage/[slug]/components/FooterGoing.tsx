import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { AxiosResponse } from "axios";
import { useState } from "react";
import MatchTimer from "./MatchTimer";
import unicaOne from "@/app/fonts/unicaOne";

const FooterGoing = function (
    { readyProp, joined, startTime, waiting, matchId } :
    { readyProp: boolean, joined: boolean, startTime: string | null, waiting: boolean, matchId: number}
) {
    const [ready, setReady] = useState<boolean>(readyProp);
    const { apiClient } = useAuth();
    const [timeRunsOut, setTimeRunsOut] = useState<boolean>(true);


    const playerReadyHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (timeRunsOut)
            return ;

        try {
            const res: AxiosResponse = await apiClient.instance.patch(`/v1/tournament/match/ready`, { matchId: matchId });

            console.log(res);

            setReady(!ready);
        } catch (err: unknown) {
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