"use client"
import { useContext, createContext, useState, ReactNode, useEffect } from "react"
import React from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { LoggedUser, MessageType } from "../types/Types";




type ChatContextType = {
  showConversation: boolean;
  setShowConversation: (show: boolean) => void;
  isLoadingFriends: boolean;
	setIsLoadingFriends: (show: boolean) => void;
  friends: any[] | null;
	BOSS: LoggedUser | null;
	socket: any;
  api: any;
	messages: MessageType[];
	setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
	// lastMessage: string;
	// setLastMessage: React.Dispatch<React.SetStateAction<string>>;
}

const ChatContext = createContext<ChatContextType | null>(null)

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === null) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context
}

type ChatProviderProps = {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [showConversation, setShowConversation] = useState(false)
  const [friends, setFriends] = useState<LoggedUser[] | null>(null)
  const [isLoadingFriends, setIsLoadingFriends] = useState(true)
	const [messages, setMessages] = useState<MessageType[]>([])
	// const [lastMessage, setLastMessage] = useState('');


  const { socket, api, user : BOSS } = useAuth()

	
	useEffect(() => {
		async function getAllFriends() {
			try {
				const allFriends = await api.getAllFriends();
				setFriends(allFriends);
			} catch (err: any) {
				console.log(err);
			} finally {
				setIsLoadingFriends(false);
			}
		}
		getAllFriends();
	}, []);



  return (
    <ChatContext.Provider value={{
      showConversation,
      setShowConversation,
			setIsLoadingFriends,
      api,
      friends,
      isLoadingFriends,
			socket,
			BOSS,
			messages,
			setMessages,
			// lastMessage,
			// setLastMessage,
    }}>
      {children}
    </ChatContext.Provider>
  )
}