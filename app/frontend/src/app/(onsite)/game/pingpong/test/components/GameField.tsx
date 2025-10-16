import { useEffect, useRef, useState } from "react";
import Overlay from "./Overlay";
import Pong from "@/app/(onsite)/game/pingpong/src/Pong";
import VersusCard from "@/app/(onsite)/game/components/Items/VersusCard";
import LoadingComponent from "@/app/(auth)/components/UI/LoadingComponents";
import RoomNotFound from "./RoomNotFound";
import { useParams } from "next/navigation";
import SocketProxy from "@/app/(onsite)/game/utils/socketProxy";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import RemotePong from "@/app/(onsite)/game/pingpong/src/game/RemotePong";



const GameField = () => {
    const { apiClient, loggedInUser } = useAuth();
	const socketProxy = useRef<SocketProxy>(SocketProxy.getInstance());
	const [isLoading, setIsLoading ] = useState(false);
	const [notFound, setNotFound ] = useState(false);
	const [opponentId, setOpponentId] = useState<number | undefined>(undefined);
    const { roomid }: { roomid: string} = useParams();
	const [ timeLeft, setTimeLeft ] = useState(0);
    const [ overlayStatus, setOverlayStatus ] = useState('none');
	const pong = useRef<RemotePong>(new RemotePong(socketProxy.current, {
        updateTimer: setTimeLeft,
        updateOverlayStatus: setOverlayStatus,
    }));


    const forfeitGame = () => {
        pong.current.forfeit();
    }


	return (
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
            { isLoading ? (
				<LoadingComponent />
            ) : notFound ? (
                <RoomNotFound />
            ) : (
                <>
                    <VersusCard opponentId={opponentId} timeLeft={timeLeft} handleResign={forfeitGame} />
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