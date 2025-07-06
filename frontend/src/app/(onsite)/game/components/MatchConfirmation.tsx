'use client';
import { motion } from "framer-motion";
import { useGameContext } from "../contexts/gameContext";
import { RefObject, useEffect, useRef } from "react";

const MatchConfirmation = function (props) {
    const { ws } = useGameContext();
    const timer: RefObject<NodeJS.Timeout | undefined> = useRef<NodeJS.Timeout | undefined>(undefined);

    const acceptHandler = function (e) {
        e.preventDefault();
        ws.current?.send(JSON.stringify({ type: "MATCH-CONFIRMATION", status: 1 }));
    };

    const cancelHandler = function (e) {
        e.preventDefault();
        ws.current?.send(JSON.stringify({ type: "MATCH-CONFIRMATION", status: 0 }));
    };

    useEffect(() => {

        timer.current = setTimeout(() => {
            ws.current?.send(JSON.stringify({ type: "MATCH-CONFIRMATION", status: 0 }));
        }, 8000);

        return () => {
            clearTimeout(timer.current);
        };

    }, [ws]);

    return (
        <>
            <div className="absolute w-[52%] h-[53%] bg-card border-br-card border-2 overflow-hidden rounded-3xl z-20">
                <motion.div className="origin-bottom w-full h-full bg-[url(/background/match/mesh-gradient.png)] opacity-50 bg-fixed bg-center bg-cover z-10"
                    animate={{ scaleY: 0 }}
                    transition={{  duration: 8, delay: 2 }} 
                    />
            </div>
            <div className="absolute w-1/2 h-1/2 flex rounded-2xl backdrop-blur-sm flex-col justify-center gap-28 z-30
                    bg-[url(/background/match/ping-pong-cover.jpeg)] bg-center bg-cover">
                <h1 className="text-4xl font-extrabold self-center">MATCH FOUND</h1>
                <div className=" flex justify-center gap-24">
                    <button className="bg-blue-700 rounded-full text-lg font-semibold py-4 px-12" onClick={acceptHandler}>ACCEPT!</button>
                    <button className="bg-card border-br-card rounded-full text-lg font-semibold py-4 px-12 border-2" onClick={cancelHandler}>DECLINE</button>
                </div>
            </div>
        </>
       );
};

export default MatchConfirmation;