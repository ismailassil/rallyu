import { useRef, useState } from "react";
import Overlay from "./Overlay";
import GameTimer from "../../../components/Items/GameTimer";
import { XOSign } from "../../../types/types";
import smoochSans from "@/app/fonts/smosh";
import TurnIndicator from "../../../components/Items/TurnIndicator";
import TicTacToe from "../../src/TicTacToe";
import LocalXO from "../../src/game/LocalXO";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

const GameField = () => {
    const t = useTranslations("game");
    const [ currentPlayer, setCurrentPlayer ] = useState<XOSign>('');
    const [ currentRound, setCurrentRound ] = useState(1);
    const [ score, setScore ] = useState<[number, number]>([0, 0]);
	const [ cells, setCells ] = useState<XOSign[]>(Array(9).fill(''));
    const [ timeLeft, setTimeLeft ] = useState(0);
    const [ result, setResult ] = useState<string | null>(null);
    const [ overlayStatus, setOverlayStatus ] = useState('none');
	const tictactoe = useRef<LocalXO>(new LocalXO({
        updateTimer: setTimeLeft,
        updateOverlayStatus: setOverlayStatus,
        updateRound: setCurrentRound,
        updateBoard: setCells,
        updateScore: setScore,
        updateDisplayedResult: setResult,
        updateCurrentPlayer: setCurrentPlayer
    }));

    const resetGame = () => {
        tictactoe.current.reset();
    }

	return (
        <div className="flex min-h-0 w-full px-10 flex-1 flex-col items-center justify-center">
            <div className="flex flex-col w-auto h-auto max-h-full max-w-full items-center justify-center">
                <div className="flex flex-col w-full max-w-[1200px] h-auto aspect-[4/3] justify-center">
                    <div className="flex min-h-0 w-full relative justify-center">
                        <div className="flex">
                            <div className="flex w-auto flex-col py-2 justify-end items-center">
                                <span className={`${smoochSans.className} text-3xl mx-3 sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold font-funnel-display text-center truncate`}>
                                    {score[0]}
                                </span>
                                <TurnIndicator indicator={'X'} currentPlayer={currentPlayer!} />
                            </div>

                            <div className={`flex flex-col ${currentRound ? 'justify-between py-2' : 'justify-end'} items-center h-full shrink-0`}>
                                <span className="text-md lg:text-lg xl:text-xl font-funnel-display font-extrabold italic">{t("ingame.round")} {currentRound}</span>
                                <GameTimer time={timeLeft} className='rounded-2xl' />
                            </div>
                            <div className="flex h-full w-auto flex-col py-2 justify-end items-center">
                                
                                <span className={`${smoochSans.className} self-center mx-3 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold font-funnel-display text-center truncate`}>
                                    {score[1]}
                                </span>
                                <TurnIndicator indicator={'O'} currentPlayer={currentPlayer!} />
                            </div>
                        </div>
                        <button
                            className={`flex gap-1 ${overlayStatus === 'countdown' ? 'cursor-not-allowed' : 'cursor-pointer'} text-xs md:text-base absolute right-0 top-1/4 w-auto h-auto ml-auto rounded-xl bg-card transition-all duration-250 hover:scale-105 opacity-70 hover:opacity-100 px-2 py-1 my-1 mx-3 border border-card`}
                            onClick={overlayStatus === 'countdown' ? undefined : resetGame}
                        >
                            <RotateCcw className="w-[15px]" />
                            <span className="font-funnel-display font-bold">{t("ingame.restart")}</span>
                        </button>
                    </div>
                    <div className="relative inline-block">
                        <TicTacToe tictactoe={tictactoe.current} board={cells} />
                        <Overlay resetHandler={resetGame} result={result} status={overlayStatus} round={currentRound} />
                    </div>
                </div>
            </div>
        </div>
	);
};

export default GameField;