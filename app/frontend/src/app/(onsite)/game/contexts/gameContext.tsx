import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameType } from '../types/PongTypes';

interface GameContextType {
  gameType: GameType;
  setGameType:  React.Dispatch<React.SetStateAction<GameType>>;

  gameTime: number;
  setGameTime: React.Dispatch<React.SetStateAction<number>>;

  opponentId: number;
  setOpponentId: React.Dispatch<React.SetStateAction<number>>;

  gameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;

  url: string | null;
  setUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used inside GameProvider');
  return context;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameType, setGameType] = useState<GameType>('pingpong');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [url, setUrl] = useState<string | null>(null);
  const [gameTime, setGameTime] = useState<number>(0);
  const [opponentId, setOpponentId] = useState<number>(0);

  return (
    <GameContext.Provider
      value={{
        gameType,
        setGameType,
        gameStarted,
        setGameStarted,
        url,
        setUrl,
        gameTime,
        setGameTime,
        opponentId,
        setOpponentId
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
