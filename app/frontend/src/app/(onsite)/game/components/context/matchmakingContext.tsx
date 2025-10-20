import React, { createContext, useContext, useState, ReactNode } from 'react';

type GameType = 'pingpong' | 'tictactoe';

interface MatchMakingContextType {
    gameQueue: GameType | null;
    setGameQueue:  React.Dispatch<React.SetStateAction<GameType | null>>;

    queueTime: number;
    setQueueTime: React.Dispatch<React.SetStateAction<number>>;

    found: boolean;
    setFound: React.Dispatch<React.SetStateAction<boolean>>;
}

const MMContext = createContext<MatchMakingContextType | undefined>(undefined);

export const useMMContext = () => {
  const context = useContext(MMContext);
  if (!context) throw new Error('useMMContext must be used inside GameProvider');
  return context;
};

export const MatchMakingProvider = ({ children }: { children: ReactNode }) => {
    const [queueTime, setQueueTime] = useState(0);
	const [gameQueue, setGameQueue] = useState<GameType | null>(null);
	const [found, setFound] = useState(false);

  return (
    <MMContext.Provider
      value={{
        gameQueue,
        setGameQueue,
        queueTime,
        setQueueTime,
        found,
        setFound,
      }}
    >
      {children}
    </MMContext.Provider>
  );
};