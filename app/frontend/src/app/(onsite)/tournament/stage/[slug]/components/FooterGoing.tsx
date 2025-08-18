import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { AxiosResponse } from "axios";
import { ParamValue } from "next/dist/server/request/params";
import { useState } from "react";

const FooterGoing = function (
    { slug, readyProp } :
    { slug: ParamValue, readyProp: boolean }
) {
    const [ready, setReady] = useState<boolean>(readyProp);
    const { api } = useAuth();


    const playerReadyHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            event.preventDefault();
            const res: AxiosResponse = await api.instance.patch(`/v1/tournament/match/ready/${slug}`);

            console.log(res);

            setReady(!ready);
        } catch (err: unknown) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <p className="text-gray-300">
                Don’t just sit there looking ready… click Ready so your opponent knows too &#8987;
            </p>
            <>
                {
                    !ready ?
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
                    </button>

                }
            </>
        </div>
    );
};

export default FooterGoing;