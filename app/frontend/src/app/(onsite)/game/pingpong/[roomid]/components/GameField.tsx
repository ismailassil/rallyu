import { useEffect, useRef, useState } from "react";
import Overlay from "./Overlay";
import Pong from "../../src/Pong";
import VersusCard from "@/app/(onsite)/game/components/Items/VersusCard";
import LoadingComponent from "@/app/(auth)/components/UI/LoadingComponents";
import RoomNotFound from "../../../components/Items/RoomNotFound";
import { useParams, useRouter } from "next/navigation";
import SocketProxy from "../../../utils/socketProxy";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import RemotePong from "../../src/game/RemotePong";

const GameField = () => {
    const router = useRouter();
    const { apiClient, loggedInUser } = useAuth();
	const [isLoading, setIsLoading ] = useState(true);
	const [notFound, setNotFound ] = useState(false);
	const [opponentId, setOpponentId] = useState<number | undefined>(undefined);
    const { roomid }: { roomid: string} = useParams();
	const [ timeLeft, setTimeLeft ] = useState(0);
	const [ oppdisconnect, setOppdisconnect ] = useState(false);
    const [ result, setResult ] = useState<string | null>(null);
    const [ overlayStatus, setOverlayStatus ] = useState('none');
    const [tournamentURL, setTournamentURL] = useState<number | null>(null);
	const socketProxy = useRef<SocketProxy>(new SocketProxy((reason: string) => {
        router.push(`/game/disconnected?reason=${reason}`)
    }));
	const pong = useRef<RemotePong>(new RemotePong(socketProxy.current, {
        updateTimer: setTimeLeft,
        updateOverlayStatus: setOverlayStatus,
        updateConnection: setOppdisconnect,
        updateDisplayedResult: setResult,
        updateTournamentURL: setTournamentURL,
    }));

    useEffect(() => {
		let disconnect: (() => void) | undefined;
		let isMounted = true;
		(async () => {
			try {
				const res = await apiClient.fetchGameRoomStatus(roomid);

				if (!isMounted) return;
                console.log('%cResult: ', 'color: red; font-size: 20px', res);

				setOpponentId(res.players.find(p => p.ID !== loggedInUser!.id)?.ID);
				setIsLoading(false);
				disconnect = socketProxy.current.connect(`/game/room/join/${roomid}?userid=${loggedInUser?.id}`, apiClient);
			} catch (err) {
				if (!isMounted) return;
				
				setIsLoading(false);
				setNotFound(true);
				console.log('Game Service: ', err);
			}
		})()
		
		return () => {
            isMounted = false;
            if (disconnect) disconnect();
        }
	}, [])

	return (
        <div className="flex min-h-0 w-full px-10 flex-1 flex-col items-center justify-center">
            { isLoading ? (
				<LoadingComponent />
            ) : notFound ? (
                <RoomNotFound />
            ) : (
                <>
                    <div className="flex flex-col w-auto h-auto max-h-full max-w-full items-center justify-center">
                        <VersusCard
                            opponentId={opponentId}
                            timeLeft={timeLeft}
                            handleResign={() => pong.current.forfeit()}
                            disconnect={oppdisconnect}
                            resignSwitch={overlayStatus === 'gameover' ? false : true}
                        />
                        <div className="relative inline-block">
                            <Pong socketProxy={socketProxy.current} pong={pong.current} />
                            <Overlay status={overlayStatus} result={result} tournamentURL={tournamentURL} />
                        </div>
                    </div>
                </>
            )
			}
        </div>
	);
};

export default GameField;