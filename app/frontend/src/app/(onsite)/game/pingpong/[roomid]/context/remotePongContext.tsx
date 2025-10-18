import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RemoteContextType {
  gameTime: number;
  setGameTime: React.Dispatch<React.SetStateAction<number>>;

  overlayStatus: string;
  setOverlayStatus: React.Dispatch<React.SetStateAction<string>>;

  gameResult: string;
  setGameResult: React.Dispatch<React.SetStateAction<string>>;
}

const RemoteContext = createContext<RemoteContextType | undefined>(undefined);

export const useRemote = () => {
  const context = useContext(RemoteContext);
  if (!context) throw new Error('useRemote must be used inside RemoteProvider');
  return context;
};

export const RemoteProvider = ({ children }: { children: ReactNode }) => {
  const [gameTime, setGameTime] = useState<number>(0);
  const [overlayStatus, setOverlayStatus] = useState<string>('none');
  const [gameResult, setGameResult] = useState<string>('none');

  return (
    <RemoteContext.Provider
      value={{
        gameTime,
        setGameTime,
        gameResult,
        setGameResult,
        overlayStatus,
        setOverlayStatus
      }}
    >
      {children}
    </RemoteContext.Provider>
  );
};