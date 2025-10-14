"use client";

import Pong from "../src/Pong";
import VersusCard from "@/app/(onsite)/game/components/Items/VersusCard";
import SocketProxy from "../../utils/socketProxy";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useParams, useSearchParams } from "next/navigation";
import LoadingComponent from "@/app/(auth)/components/UI/LoadingComponents";
import { motion } from "framer-motion";
import RoomNotFound from "./components/RoomNotFound";

const Game = () => {
	const { apiClient, loggedInUser } = useAuth();
	const socketProxy = useRef<SocketProxy>(SocketProxy.getInstance());
	const [isLoading, setIsLoading ] = useState(true);
	const [notFound, setNotFound ] = useState(false);
	const [opponentId, setOpponentId] = useState<number | undefined>(undefined);
    const { roomid }: { roomid: string} = useParams();
	const [ timeLeft, setTimeLeft ] = useState(0);

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
		
		return disconnect;
	}, [])

	return (
		<motion.main
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="h-[100vh] pt-30 pr-6 pb-24 pl-6 sm:pb-6 sm:pl-30"
		>
			<article className="bg-card border-br-card flex h-full w-full justify-center rounded-2xl border-2">
				{ isLoading ? (
					<LoadingComponent />
				) : notFound ? (
					<RoomNotFound />
				) : (
					<div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
						<VersusCard opponentId={opponentId} timeLeft={timeLeft} />
						<div className="flex min-h-0 w-full flex-1 items-center justify-center">
							<Pong socketProxy={socketProxy.current} mode='remote' updateTimer={setTimeLeft} />
						</div>
					</div>
				)
				}
			</article>
		</motion.main>
	);
};

export default Game;