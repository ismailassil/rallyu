"use client"
import { useContext, createContext, useState, ReactNode, useEffect } from "react"
import React from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { LoggedUser, MessageType } from "../types/chat.types";



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
	selectedUser: LoggedUser | null;
	setSelectedUser : React.Dispatch<React.SetStateAction<LoggedUser | null>>;
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
	const [selectedUser, setSelectedUser] = useState<LoggedUser | null>(null)
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

	useEffect(() => {
		function handleMessage(data: MessageType) {
				// console.log(data);
				setMessages((prev) => [...prev, data]);
		}
		
		function handleUpdateMessage(data: MessageType) {
				// console.log(data);
				setMessages((prev) => [...prev, data]);
		}

		socket.on('chat_receive_msg', handleMessage)
		socket.on('chat_update_msg', handleUpdateMessage)
		return () => {
			socket.off("chat_receive_msg", handleMessage);
			socket.off("chat_update_msg", handleUpdateMessage);
		}
	}, [])

  return (
    <ChatContext.Provider value={{
      showConversation,
      setShowConversation,
      isLoadingFriends,
			setIsLoadingFriends,
      api,
      friends,
			socket,
			BOSS,
			messages,
			setMessages,
			selectedUser,
			setSelectedUser,
    }}>
      {children}
    </ChatContext.Provider>
  )
}