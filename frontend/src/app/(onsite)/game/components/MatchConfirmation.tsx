'use client';

import { motion } from "framer-motion";

const MatchConfirmation = function (props) {

    return <>
        <motion.div className="absolute origin-bottom w-[52%] h-[53%] bg-[url(/background/match/mesh-gradient.png)]  bg-fixed bg-center bg-cover z-10"
            animate={{ scaleY: 0 }}
            transition={{  duration: 8, delay: 2 }}
        />
        <div className="absolute w-[52%] h-[53%] bg-card border-br-card border-2  rounded-3xl z-20">
        </div>
        <div className="absolute w-1/2 h-1/2 flex rounded-2xl backdrop-blur-sm flex-col justify-center gap-28 z-30
                bg-[url(/background/match/ping-pong-cover.jpeg)] bg-center bg-cover">
            <h1 className="text-4xl font-extrabold self-center">MATCH FOUND</h1>
            <div className=" flex justify-center gap-24">
                <button className="bg-blue-700 rounded-full text-lg font-semibold py-4 px-12">ACCEPT!</button>
                <button className="bg-card border-br-card rounded-full text-lg font-semibold py-4 px-12 border-2">DECLINE</button>
            </div>
            
        </div>
    </>;
};

export default MatchConfirmation;