import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import unicaOne from "@/app/fonts/unicaOne";
import { ParamValue } from "next/dist/server/request/params";
import { Dispatch, SetStateAction } from "react";

const FooterPending = function (
    { joined, setJoined, slug, title }:
    { joined: boolean | undefined, setJoined: Dispatch<SetStateAction<boolean | undefined>>, slug: ParamValue, title: string }
) {
    const { api, user } = useAuth();

    const joinTournamentHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await api.instance.patch(`/v1/tournament/match/join/${slug}`, { id: user?.id });
            
            setJoined(true);
        } catch (err: unknown) {
            console.error(err);
        }
    };

    const leaveTournamentHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await api.instance.patch(`/v1/tournament/match/leave/${slug}`, { id: user?.id });

            setJoined(false);
        } catch (err: unknown) {
            console.log(err);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <p className="text-gray-300">
                Join
                <span className={`font-black ${unicaOne.className}`}> { title } </span>
                Tournament and compete for the trophy! &#129351;</p>
            <>
                {
                    !joined ? (
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
                    ) : (
                        <button
                            className="bg-card border-card min-w-45 min-h-10 hover:scale-102 group
                                        relative flex cursor-pointer
                                        items-center justify-center gap-3
                                        overflow-hidden rounded-lg border text-sm
                                        transition-all duration-300
                            "
                            onClick={leaveTournamentHandler}
                        >
                            Leave
                        </button>
                    )
                }
            </>
        </div>
    );
};

export default FooterPending;