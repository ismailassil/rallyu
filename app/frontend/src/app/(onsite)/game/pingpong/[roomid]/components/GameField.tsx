import { useEffect, useRef, useState } from "react";
import Overlay from "./Overlay";
import Pong from "../../src/Pong";
import VersusCard from "@/app/(onsite)/game/components/Items/VersusCard";
import LoadingComponent from "@/app/(auth)/components/UI/LoadingComponents";
import RoomNotFound from "../../../utils/RoomNotFound";
import { useParams } from "next/navigation";
import SocketProxy from "../../../utils/socketProxy";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import RemotePong from "../../src/game/RemotePong";

const GameField = () => {
    const { apiClient, loggedInUser } = useAuth();
	const socketProxy = useRef<SocketProxy>(new SocketProxy());
	const [isLoading, setIsLoading ] = useState(true);
	const [notFound, setNotFound ] = useState(false);
	const [opponentId, setOpponentId] = useState<number | undefined>(undefined);
    const { roomid }: { roomid: string} = useParams();
	const [ timeLeft, setTimeLeft ] = useState(0);
	const [ oppdisconnect, setOppdisconnect ] = useState(false);
    const [ overlayStatus, setOverlayStatus ] = useState('none');
	const pong = useRef<RemotePong>(new RemotePong(socketProxy.current, {
        updateTimer: setTimeLeft,
        updateOverlayStatus: setOverlayStatus,
        updateConnection: setOppdisconnect
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
				console.log(`Game Service: ${err}`);
			}
		})()
		
		return () => {
            if (disconnect) disconnect();
        }
	}, [])

    const forfeitGame = () => {
        pong.current.forfeit();

        // if (pong.current.gamePlayStatus !== 'gameover' && pong.current.gamePlayStatus !== 'countdown')
        //     setPause(!pause);
    }


	return (
        <div className="flex min-h-0 w-full px-10 flex-1 flex-col items-center justify-center">
            { isLoading ? (
				<LoadingComponent />
            ) : notFound ? (
                <RoomNotFound />
            ) : (
                <>
                    <VersusCard
                        opponentId={opponentId}
                        timeLeft={timeLeft}
                        handleResign={forfeitGame}
                        disconnect={oppdisconnect}
                        resignSwitch={true}
                    />
                    <div className="flex w-auto h-auto max-h-full max-w-full items-center justify-center">
                        <div className="relative inline-block">
                            <Pong socketProxy={socketProxy.current} pong={pong.current} />
                            <Overlay status={overlayStatus} />
                        </div>
                    </div>
                </>
            )
			}
        </div>
	);
};

export default GameField;