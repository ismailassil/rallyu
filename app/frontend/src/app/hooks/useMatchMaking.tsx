import { useEffect, useRef, useState } from "react";
import { GameType, useGame } from "../(onsite)/game/contexts/gameContext";
import { useAuth } from "../(onsite)/contexts/AuthContext";

const useMatchmaking = (gameType: GameType) => {
    const [queueTime, setQueueTime] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
	  const { setUrl, setOpponentId, setGameMode, setGameType, setGameStarted } = useGame();
    const { apiClient, loggedInUser, isBusy, setIsBusy } = useAuth();
    const wsRef = useRef<WebSocket | null>(null);
  
    useEffect(() => {
      let interval: NodeJS.Timeout;
      if (!loggedInUser) return;
      
      if (isSearching) {
        interval = setInterval(() => {
          setQueueTime(t => t + 1);
        }, 1000);
        
        const ws = apiClient.connectWebSocket(`/v1/matchmaking/${gameType}/join`);
        wsRef.current = ws;
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          ws.send(JSON.stringify({ id: loggedInUser.id }));
        };
        
        ws.onmessage = (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            setUrl(`/game/room/${data.roomId}?user=${loggedInUser.id}`);
            setOpponentId(data.opponentId);
            setGameType(gameType);
            setGameMode('online');
            setGameStarted(true);
            setIsSearching(false);
            setIsBusy(false);
            ws.close();
          } catch (err) {
            console.error("Invalid JSON from server: ", err);
          }
        }
        
        ws.onclose = (event: CloseEvent) => {
          if (event.code === 1001) {
            console.log(event.reason);
            setIsSearching(false);
            setIsBusy(false);
          }
        }
      } else if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        setQueueTime(0);
      }
      
      return () => {
        if (isBusy) setIsBusy(false);
        clearInterval(interval);
      };
    }, [isSearching, gameType]);
  
    const startSearch = () => setIsSearching(true);
    const stopSearch = () => setIsSearching(false);
    const toggleSearch = () => setIsSearching(prev => !prev);
  
    return { queueTime, isSearching, startSearch, stopSearch, toggleSearch };
};

export default useMatchmaking;