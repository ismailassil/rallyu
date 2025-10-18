/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useContext, createContext, useState, ReactNode, useEffect } from "react";
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
	apiClient: any;
	messages: MessageType[];
	setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
	selectedUser: LoggedUser | null;
	setSelectedUser: React.Dispatch<React.SetStateAction<LoggedUser | null>>;
	handleSendGame: (targetId: number | undefined, gameType: "pingpong" | "tictactoe") => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
	const context = useContext(ChatContext);
	if (context === null) {
		throw new Error("useChat must be used within a ChatProvider");
	}
	return context;
};

type ChatProviderProps = {
	children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
	const [showConversation, setShowConversation] = useState(false);
	const [friends, setFriends] = useState<LoggedUser[] | null>(null);
	const [isLoadingFriends, setIsLoadingFriends] = useState(true);
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [selectedUser, setSelectedUser] = useState<LoggedUser | null>(null);
	const { socket, apiClient, loggedInUser: BOSS } = useAuth();

	useEffect(() => {
		async function getAllFriends() {
			try {
				const allFriends = await apiClient.getAllFriends();
				setFriends(allFriends);
			} catch (err: any) {
				console.log(err);
			} finally {
				setIsLoadingFriends(false);
			}
		}
		getAllFriends();
	}, [showConversation, selectedUser, apiClient]);

	const playMessageSound = () => {
		const audio = new Audio("/message.mp3");
		audio.play().catch((e) => {
			console.log("Failed to play sound:", e);
		});
	};

	useEffect(() => {
		function handleMessage(data: MessageType) {
			playMessageSound();
			setMessages((prev) => [...prev, data]);
		}

		function handleUpdateMessage(data: MessageType) {
			setMessages((prev) => [...prev, data]);
		}

		socket.on('chat_receive_msg', handleMessage);
		socket.on('chat_update_msg', handleUpdateMessage);
		return () => {
			socket.off("chat_receive_msg", handleMessage);
			socket.off("chat_update_msg", handleUpdateMessage);
		};
	}, [socket]);


	useEffect(() => {
		if (!BOSS?.id) return;

		apiClient.instance.get('/chat/history')
			.then((response: any) => {
				setMessages(response?.data);
			})
			.catch((error: any) => {
				console.error("Error fetching chat history:", error);
			});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSendGame = async (targetId: number | undefined, gameType: "pingpong" | "tictactoe") => {
		if (targetId === undefined) return;
		socket.createGame(targetId, gameType);
	};

	return (
		<ChatContext.Provider value={{
			showConversation,
			setShowConversation,
			isLoadingFriends,
			setIsLoadingFriends,
			apiClient,
			friends,
			socket,
			BOSS,
			messages,
			setMessages,
			selectedUser,
			setSelectedUser,
			handleSendGame,
		}}>
			{children}
		</ChatContext.Provider>
	);
};
