import React, { createContext, useContext, useState, ReactNode } from 'react';

type GameType = 'pingpong' | 'tictactoe';

interface GameContextType {
  gameType: GameType;
  setGameType:  React.Dispatch<React.SetStateAction<GameType>>;

  connection: boolean;
  toggleConnection: () => void;

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
  const [connection, setConnection] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  const toggleConnection = () => {
    setConnection(prev => !prev);
  };

  return (
    <GameContext.Provider
      value={{
        gameType,
        setGameType,
        connection,
        toggleConnection,
        url,
        setUrl
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
