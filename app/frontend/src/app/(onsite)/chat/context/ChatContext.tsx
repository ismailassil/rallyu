"use client"
import { useContext, createContext, useState, ReactNode, useEffect } from "react"
import React from 'react';
import { io, Socket } from "socket.io-client"
import { useAuth } from "../../contexts/AuthContext";

type ChatContextType = {
  showConversation: boolean;
  setShowConversation: (show: boolean) => void;
}

const ChatContext = createContext<ChatContextType | null>(null)

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === null) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context
}

// Fixed: ChatProvider should accept children, not ChatContextType props
type ChatProviderProps = {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [showConversation, setShowConversation] = useState(false)
  // const [socket, setSocket] = useState<Socket | null>(null);
  // const [isConnected, setIsConnected] = useState(false);
	// const { socket } = useAuth();

  useEffect(() => {

  }, []);

  return (
    <ChatContext.Provider value={{ 
      showConversation,
      setShowConversation
    }}>
      {children}
    </ChatContext.Provider>
  )
}