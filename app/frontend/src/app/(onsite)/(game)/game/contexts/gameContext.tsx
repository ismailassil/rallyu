import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

export type GameType = 'pingpong' | 'tictactoe';

export type GameMode = 'online' | 'local';

export interface GameContextState {
  gameType: GameType;
  gameMode: GameMode;
  gameTime: number;
  opponentId: number;
  gameStarted: boolean;
  url: string | null;
}

interface GameContextType {
  gameState: GameContextState;
  setGameState: React.Dispatch<React.SetStateAction<GameContextState>>;
  updateGameState: (updates: Partial<GameContextState> | ((prev: GameContextState) => Partial<GameContextState>)) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used inside GameProvider');
  return context;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameContextState>({
    gameType: 'pingpong',
    gameMode: 'online',
    gameTime: 0,
    opponentId: 0,
    gameStarted: false,
    url: null
  });

  const updateGameState = useCallback((
    updates: Partial<GameContextState> | ((prev: GameContextState) => Partial<GameContextState>)
  ) => {
    if (typeof updates === 'function') {
      setGameState(prev => {
        const updatesObj = updates(prev);
        return { ...prev, ...updatesObj };
      });
    } else {
      setGameState(prev => ({ ...prev, ...updates }));
    }
  }, []);

  const value = useMemo(() => ({
    gameState,
    setGameState,
    updateGameState
  }), [gameState, updateGameState]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
