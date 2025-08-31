import { Dispatch, SetStateAction, useEffect, useState } from "react";

const MatchTimer = function (
    { startTime, timeRunsOut, setTimeRunsOut } :
    { startTime: string | null, timeRunsOut: boolean, setTimeRunsOut: Dispatch<SetStateAction<boolean>> }
) {
    const [timeDisplay, setTimeDisplay] = useState("--:--");

    useEffect(() => {
        if (!startTime)
            return ;

        const startDate = new Date(startTime as string).getTime() + (5 * 60 * 1000) + (1000 * 60 * 60);

        const timer = setInterval(() => {
            if (Date.now() > startDate) {
                setTimeDisplay("00:00");
                setTimeRunsOut(true);
                clearInterval(timer);
                return ;
            }

            const dum = startDate - Date.now();
            const mins = Math.floor((dum % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((dum % (1000 * 60)) / 1000);
            setTimeDisplay(`${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
            if (timeRunsOut)
                setTimeRunsOut(false);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="font-bold text-4xl text-gray-300 font-mono">
            <p>{ timeDisplay }</p>
        </div>
    );
};

export default MatchTimer;