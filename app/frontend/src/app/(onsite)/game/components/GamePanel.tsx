import unicaOne from "@/app/fonts/unicaOne";
import { AnimatePresence, motion } from "framer-motion";
import PingPongOptions from "./PingPongOptions";
import TicTacToeOptions from "./TicTacToeOptions";
import QueueButton from "./Items/QueueButton";
import GameStyle from "./Items/GameStyle";
import PickGame from "./Items/PickGame";
import { useGameContext } from "../contexts/gameContext";
import { useTicTacToe } from "../../contexts/tictactoeContext";
import { usePingPong } from "../../contexts/pingpongContext";

import React from 'react';

const AnimatedButton = () => {
  const letters = ['B', 'U', 'T', 'T', 'O', 'N'];
  
  return (
    <button className="
      group relative
      inline-block
      border border-solid border-black
      rounded-full
      bg-black
      py-[1.2rem] px-[3rem]
      font-sans
      text-base
      font-extrabold
      uppercase
      leading-normal
      text-white
      overflow-hidden
      select-none
      cursor-pointer
      box-border
      [-webkit-tap-highlight-color:transparent]
      [-webkit-appearance:button]
      [-webkit-mask-image:-webkit-radial-gradient(#000,#fff)]
      hover:outline-none
    ">
      {/* Original text layer */}
      <div className="
        absolute inset-0
        grid place-content-center
        bg-white text-black
        transition-transform
        duration-200
        ease-[cubic-bezier(0.87,0,0.13,1)]
        group-hover:translate-y-full
      ">
        Button
      </div>
      
      {/* Animated letters */}
      <div className="inline-flex">
        {letters.map((letter, index) => (
          <span 
            key={index}
            className={`
              inline-block
              opacity-0
              ${
                index % 2 === 0 
                  ? '-translate-y-[15px]' 
                  : 'translate-y-[15px]'
              }
              transition-all
              duration-200
              ease-[cubic-bezier(0.87,0,0.13,1)]
              group-hover:opacity-100
              group-hover:translate-y-0
            `}
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </button>
  );
};

function GamePanel() {
	const { gameType } = useGameContext();
	const { connectivity: tConnect, setConnectivity: updatetConnect } = useTicTacToe();
	const { connectivity: pConnect, setConnectivity: updatepConnect } = usePingPong();

	return (
		<AnimatePresence>
			<div className="hide-scrollbar flex h-full flex-1 flex-col">
				<h1 className={`p-4 text-4xl ${unicaOne.className} font-semibold uppercase`}>
					<span className="font-semibold">Customize Your World!</span>
				</h1>
				<motion.div
					initial={{ opacity: 0, x: -100 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 1, delay: 0.1 }}
					className={`custom-scroll flex h-full flex-col gap-5 overflow-y-scroll p-4`}
				>
					<PickGame label="Pick Your Game" />
					<GameStyle
						connectivity={gameType === "pingpong" ? pConnect : tConnect}
						setConnectivity={gameType === "pingpong" ? updatepConnect : updatetConnect}
					/>
					{gameType === "pingpong" ? <PingPongOptions /> : <TicTacToeOptions />}
				</motion.div>
				<AnimatedButton />
			</div>
		</AnimatePresence>
	);
}

export default GamePanel;
