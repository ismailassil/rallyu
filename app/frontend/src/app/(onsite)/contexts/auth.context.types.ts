/* eslint-disable @typescript-eslint/no-explicit-any */
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
	avatar_url: string,
	phone: string,
	phone_verified: boolean,
	email_verified: boolean,
	last_message : MessageType
}

export type AuthContextType = {
	loggedInUser: LoggedInUser | null;
	updateLoggedInUserState: (payload: Partial<LoggedInUser>) => void;
	triggerLoggedInUserRefresh: () => void;
	isLoading: boolean;
	isAuthenticated: boolean;
	isBusy: boolean;
	setIsBusy: React.Dispatch<React.SetStateAction<boolean>>;

	register: (first_name: string, last_name: string, username: string, email: string, password: string) => Promise<void>;
	login: (username: string, password: string) => Promise<any>;
	send2FACode: (token: string, method: string) => Promise<any>;
	loginUsing2FA: (token: string, code: string) => Promise<any>;
	logout: () => Promise<void>;

	apiClient: APIClient;
	socket: SocketClient;
}
