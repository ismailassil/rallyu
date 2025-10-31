import { toastSuccess } from "@/app/components/CustomToast";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import unicaOne from "@/app/fonts/unicaOne";
import { CloudWarningIcon, MaskSad } from "@phosphor-icons/react";
import { ParamValue } from "next/dist/server/request/params";
import { Dispatch, SetStateAction, useState } from "react";
import { Toaster } from "sonner";
import { useTranslations } from "next-intl";

const FooterPending = function (
    { joined, setJoined, slug, title, contenders_size, contenders_joined }:
    { joined: boolean | undefined, setJoined: Dispatch<SetStateAction<boolean>>, slug: ParamValue, title: string, contenders_size: number, contenders_joined: number }
) {
    const { apiClient, loggedInUser } = useAuth();
    const [error, setError] = useState({
        status: false,
        message: ""
    });
    const translate = useTranslations("tournament")
    const [cJoined, setCJoined] = useState<number>(contenders_joined);

    const joinTournamentHandler = async (e) => {
        e.preventDefault();
        try {
            await apiClient.instance.patch(`/v1/tournament/match/join/${slug}`, { id: loggedInUser?.id });

            toastSuccess(translate("bracket.pending.join"));
            setJoined(true);
            setError({ status: false, message: "" });
            setCJoined(prev => ++prev);
            console.log(cJoined)
        } catch (err: unknown) {
            console.error(err);
            setError({ status: true, message: translate("bracket.pending.error") });
        }
    };
    
    const leaveTournamentHandler = async (e) => {
        e.preventDefault();
        try {
            await apiClient.instance.patch(`/v1/tournament/match/leave/${slug}`, { id: loggedInUser?.id });
            
            toastSuccess(translate("bracket.pending.leave"));
            setJoined(false);
            setError({ status: false, message: "" });
            setCJoined(prev => --prev)
            console.error(cJoined)
        } catch (err: unknown) {
            console.error(err);
            setError({ status: true, message: translate("bracket.pending.error") });
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div>
                <p className="text-gray-300 text-center sm:text-left">
                    { translate("bracket.pending.header.join") }
                    <span className={`font-black ${unicaOne.className} text-white`}> { title } </span>
                    { translate("bracket.pending.header.join-welcoming") } &#129351;
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
                    !joined && !(cJoined === contenders_size) &&
                        <button
                            className="bg-main hover:scale-102 py-3 px-24
                                        cursor-pointer
                                        rounded-lg text-sm
                                        transition-all duration-300
                                        self-stretch sm:self-center
                            "
                                            onClick={joinTournamentHandler}
                        >
                            {translate("bracket.pending.buttons.join")}
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
                            {translate("bracket.pending.buttons.leave")}
                        </button>
                }
                {
                    !joined && (cJoined === contenders_size) &&
                        <div
                            className="flex items-center justify-center gap-1 rounded-sm 
                                        cursor-auto py-3 px-22 outline-white/10 outline
                                        self-stretch sm:self-center
                                        text-sm
                            "
                        >
                            <span>{translate("bracket.pending.buttons.full")}</span>
                            <MaskSad size={18} />
                        </div>
                }
            </>
            <Toaster position='bottom-right' visibleToasts={1} />
        </div>
    );
};

export default FooterPending;