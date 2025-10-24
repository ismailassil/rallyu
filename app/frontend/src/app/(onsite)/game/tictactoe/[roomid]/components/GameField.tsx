import { useEffect, useRef, useState } from "react";
import Overlay from "./Overlay";
import VersusCard from "@/app/(onsite)/game/components/Items/VersusCard";
import LoadingComponent from "@/app/(auth)/components/UI/LoadingComponents";
import RoomNotFound from "../../../components/Items/RoomNotFound";
import { useParams, useRouter } from "next/navigation";
import SocketProxy from "../../../utils/socketProxy";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import RemoteXO from "../../src/game/RemoteXO";
import TicTacToe from "../../src/TicTacToe";
import { XOSign } from "../../../types/types";

const GameField = () => {
    const [ oppdisconnect, setOppdisconnect ] = useState(false);
    const [ sign, setSign ] = useState<XOSign>('');
    const [ currentPlayer, setCurrentPlayer ] = useState<XOSign>('');
    const [ overlayStatus, setOverlayStatus ] = useState('none');
    const [ currentRound, setCurrentRound ] = useState(1);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ notFound, setNotFound ] = useState(false);
	const [ opponentId, setOpponentId ] = useState<number | undefined>(undefined);
	const [ timeLeft, setTimeLeft ] = useState(0);
    const [ score, setScore ] = useState<[number, number]>([0, 0]);
    const [ result, setResult ] = useState<string | null>(null);
	const [ cells, setCells ] = useState<XOSign[]>(Array(9).fill(''));
    const router = useRouter();

    const { roomid }: { roomid: string} = useParams();
    const { apiClient, loggedInUser } = useAuth();
	const socketProxy = useRef<SocketProxy>(new SocketProxy((reason: string) => {
        router.push(`/game/disconnected?reason=${reason}`);
    }));
	const tictactoe = useRef<RemoteXO>(new RemoteXO(socketProxy.current, {
        updateTimer: setTimeLeft,
        updateOverlayStatus: setOverlayStatus,
        updateConnection: setOppdisconnect,
        updateRound: setCurrentRound,
        updateBoard: setCells,
        updateScore: setScore,
        updateDisplayedResult: setResult,
        updateCurrentPlayer: setCurrentPlayer,
        updateSign: setSign
    }));

    useEffect(() => {
		let disconnect: (() => void) | undefined;
		let isMounted = true;
		(async () => {
			try {
				const res = await apiClient.fetchGameRoomStatus(roomid);

				if (!isMounted) return;

				setOpponentId(res.players.find(p => p.ID !== loggedInUser!.id)?.ID);
				setIsLoading(false);
				disconnect = socketProxy.current.connect(`/game/room/join/${roomid}?userid=${loggedInUser?.id}`, apiClient);
			} catch (err) {
				if (!isMounted) return;
				
				setIsLoading(false);
				setNotFound(true);
				console.log('Game Service: ',err);
			}
		})()
		
		return () => {
            isMounted = false;
            if (disconnect) disconnect();
        }
	}, [])

    const forfeitGame = () => {
        tictactoe.current.forfeit();
    }


	return (
        <div className="flex min-h-0 w-full px-10 flex-1 flex-col items-center justify-center">
            { isLoading ? (
				<LoadingComponent />
            ) : notFound ? (
                <RoomNotFound />
            ) : (

                    <div className="flex flex-col w-full max-w-[1200px] aspect-[4/3] items-center justify-between">
                        <VersusCard
                            opponentId={opponentId}
                            timeLeft={timeLeft}
                            handleResign={forfeitGame}
                            disconnect={oppdisconnect}
                            round={currentRound}
                            score={score}
                            resignSwitch={overlayStatus === 'gameover' ? false : true}
                            playerSign={sign}
                            currentPlayer={currentPlayer}
                        />
                        <div className="relative w-full max-w-[750px]">
                            <TicTacToe tictactoe={tictactoe.current} board={cells} />
                            <Overlay status={overlayStatus} result={result} round={currentRound} />
                        </div>
                    </div>
            )}
        </div>
	);
};

export default GameField;