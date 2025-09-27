import { toastSuccess } from "@/app/(auth)/components/CustomToast";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import unicaOne from "@/app/fonts/unicaOne";
import { CloudWarningIcon, MaskSad } from "@phosphor-icons/react";
import { ParamValue } from "next/dist/server/request/params";
import { Dispatch, SetStateAction, useState } from "react";
import { Toaster } from "sonner";

const FooterPending = function (
    { joined, setJoined, slug, title, full }:
    { joined: boolean | undefined, setJoined: Dispatch<SetStateAction<boolean | undefined>>, slug: ParamValue, title: string, full: boolean }
) {
    const { api, user } = useAuth();
    const [error, setError] = useState({
        status: false,
        message: "Something went wrong; Try again later!"
    });

    const joinTournamentHandler = async (e) => {
        e.preventDefault();
        try {
            await api.instance.patch(`/v1/tournament/match/join/${slug}`, { id: user?.id });

            toastSuccess("Joined the tournament successfully");
            setJoined(true);
            setError({ status: false, message: "" });
        } catch (err: unknown) {
            setError({ status: true, message: "Something went wrong; Try again later!" });
        }
    };
    
    const leaveTournamentHandler = async (e) => {
        e.preventDefault();
        try {
            await api.instance.patch(`/v1/tournament/match/leave/${slug}`, { id: user?.id });

            toastSuccess("Left the tournament successfully");
            setJoined(false);
            setError({ status: false, message: "" });
        } catch (err: unknown) {
            setError({ status: true, message: "Something went wrong; Try again later!" });
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div>
                <p className="text-gray-300 text-center sm:text-left">
                    Join
                    <span className={`font-black ${unicaOne.className} text-white`}> { title } </span>
                    Tournament and compete for the trophy! &#129351;
                </p>
                <>
                    {
                        error.status &&
                            <div className="flex items-center gap-1">
                                <CloudWarningIcon size={21} className="text-red-400"/>
                                <p className="text-red-400">
                                    { error.message }
                                </p>
                            </div>
                    }
                </>
            </div>
            <>
                {
                    !joined && !full &&
                        <button
                            className="bg-main hover:scale-102 py-3 px-24
                                        cursor-pointer
                                        rounded-lg text-sm
                                        transition-all duration-300
                                        self-stretch sm:self-center
                            "
                                            onClick={joinTournamentHandler}
                        >
                            Join
                        </button>
                } 
                {   
                    joined &&
                        <button
                            className="bg-card border-card hover:scale-102 py-3 px-24
                                        cursor-pointer
                                        rounded-lg text-sm
                                        transition-all duration-300
                                        self-stretch sm:self-center
                            "
                            onClick={leaveTournamentHandler}
                        >
                            Leave
                        </button>
                }
                {
                    !joined && full &&
                        <div
                            className="flex items-center justify-center gap-1 rounded-sm 
                                        cursor-auto py-3 px-22 outline-white/10 outline
                                        self-stretch sm:self-center
                                        text-sm
                            "
                        >
                            <span>Full</span>
                            <MaskSad size={18} />
                        </div>
                }
            </>
            <Toaster position='bottom-right' visibleToasts={1} />
        </div>
    );
};

export default FooterPending;