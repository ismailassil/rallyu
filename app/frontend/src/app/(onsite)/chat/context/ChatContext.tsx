"use client";
import { useContext, createContext, useState, ReactNode, useEffect } from "react";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LoggedUser, MessageType } from "../types/chat.types";
import { format, isToday, isYesterday, parseISO, isSameDay } from "date-fns";
import { useTranslations } from "next-intl";

type ChatContextType = {
	showConversation: boolean;
	setShowConversation: (show: boolean) => void;
	isLoadingFriends: boolean;
	setIsLoadingFriends: (show: boolean) => void;
	BOSS: LoggedUser | null;
	socket: any;
	apiClient: any;
	messages: MessageType[];
	setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
	selectedUser: LoggedUser | null;
	setSelectedUser: React.Dispatch<React.SetStateAction<LoggedUser | null>>;
	formatMessageDateTime: (
		currentMsg: string,
		mode: "conversation" | "list",
		prevMsg?: string | undefined
	) => { date: string; time: string };
	displayUsers: LoggedUser[];
	setDisplayUsers: React.Dispatch<React.SetStateAction<LoggedUser[]>>;
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
};

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
	const [showConversation, setShowConversation] = useState(false);
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [selectedUser, setSelectedUser] = useState<LoggedUser | null>(null);
	const { socket, apiClient, loggedInUser: BOSS } = useAuth();
	const [displayUsers, setDisplayUsers] = useState<LoggedUser[]>([]);
	const [isLoadingFriends, setIsLoadingFriends] = useState(true);
	const t = useTranslations("chat");

	useEffect(() => {
		if (!BOSS?.id) return;
		apiClient.instance.get('/chat/friend_list')
			.then((response: any) => {
				setDisplayUsers(response.data);
			})
			.catch((error: Error) => {
				console.error("Error fetching chat history:", error);
			}).finally(() => {
				setIsLoadingFriends(false);
			});
	}, [BOSS?.id, apiClient]);

	useEffect(() => {
		socket.updateContext("chat");
	}, [socket]);

	const playMessageSound = () => {
		const audio = new Audio("/message.mp3");
		audio.play().catch((e) => {
			console.log("Failed to play sound:", e);
		});
	};

	useEffect(() => {
		function handleMessage(data: MessageType) {

			if (!data || !data.senderId || !data.receiverId || !data.text) {
				console.error('Invalid message data received:', data);
				return;
			}

			playMessageSound();
			setMessages((prev) => [...prev, data]);

			const friendId = data.senderId === BOSS?.id ? data.receiverId : data.senderId;

			setDisplayUsers(prevUsers => {
				const updatedFriend = prevUsers.find(user => user.id === friendId);
				if (!updatedFriend) return prevUsers;

				return [
					{ ...updatedFriend, last_message: data },
					...prevUsers.filter(user => user.id !== friendId)
				];
			});
		}

		function handleUpdateMessage(data: MessageType) {
			setMessages((prev) => [...prev, data]);
		}

		socket.on("chat_receive_msg", handleMessage);
		socket.on("chat_update_msg", handleUpdateMessage);
		return () => {
			socket.off("chat_receive_msg", handleMessage);
			socket.off("chat_update_msg", handleUpdateMessage);
		};
	}, [socket, BOSS?.id]);


	const formatMessageDateTime = (currentMsg: string | undefined, mode: 'conversation' | 'list', prevMsg?: string,) => {

		if (!currentMsg) return { date: "", time: "" };

		const currentDate = parseISO(currentMsg + "Z");
		const prevDate = prevMsg ? parseISO(prevMsg + "Z") : null;

		let date = "";
		const time = format(currentDate, "HH:mm");

		if (mode === "conversation") {
			if (prevDate && isSameDay(currentDate, prevDate)) {
				date = "";
			} else if (isToday(currentDate)) {
				date = t("dates.today");
			} else if (isYesterday(currentDate)) {
				date = t("dates.yesterday");
			} else {
				date = format(currentDate, "dd/MM/yyyy");
			}
		} else if (mode === "list") {
			if (isToday(currentDate)) {
				date = time;
			} else if (isYesterday(currentDate)) {
				date = t("dates.yesterday");
			} else {
				date = format(currentDate, "dd/MM/yyyy");
			}
		}

		return { date, time };
	};

	return (
		<ChatContext.Provider value={{
			showConversation,
			setShowConversation,
			isLoadingFriends,
			setIsLoadingFriends,
			apiClient,
			socket,
			BOSS,
			messages,
			setMessages,
			selectedUser,
			setSelectedUser,
			formatMessageDateTime,
			displayUsers,
			setDisplayUsers,
		}}>
			{children}
		</ChatContext.Provider>
	);
};
