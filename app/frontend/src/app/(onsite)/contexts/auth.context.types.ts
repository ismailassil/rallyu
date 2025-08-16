import { APIClient } from "@/app/(api)/APIClient";
import { MessageType } from "../chat/types/chat.types";
import SocketClient from "@/app/(api)/SocketClient";

export type LoggedInUser = {
	id: number,
	first_name: string,
	last_name: string,
	username: string,
	email: string,
	bio: string,
	avatar_path: string,
	avatar_url: string,
	last_message : MessageType
}

export type AuthContextType = {
	loggedInUser: LoggedInUser | null;
	updateLoggedInUserState: (payload: Partial<LoggedInUser>) => void;
	isLoading: boolean;
	isAuthenticated: boolean;

	register: (first_name: string, last_name: string, username: string, email: string, password: string) => Promise<void>;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;

	apiClient: APIClient;
	socket: SocketClient;
}