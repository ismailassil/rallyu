"use client";
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
}

// Create the context
const SocketContext = createContext<SocketContextType | null>(null);

// Provider component
export const SocketProvider = ({ children }: { children: ReactNode }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // // const socketInstance = io('http://localhost:4000');
    
    // socketInstance.on('connect', () => {
    //   setIsConnected(true);
    // });
    
    // socketInstance.on('disconnect', () => {
    //   setIsConnected(false);
    // });

    // setSocket(socketInstance);

    // return () => {
    //   socketInstance.disconnect();
    // };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Export context for direct use if needed
export default SocketContext;