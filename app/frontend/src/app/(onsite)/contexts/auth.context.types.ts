import { APIClient } from "@/app/(api)/APIClient";
import { MessageType } from "../chat/types/chat.types";
import SocketClient from "@/app/(api)/SocketClient";

export type LoggedInUser = {
	id: number;
	email: string;
	username: string;
	first_name: string;
	last_name: string;
	bio: string;
	avatar_url: string;
	auth_provider: "Local" | "Google" | "42";
	role: "user" | "mod" | "admin" | string;
	created_at: number;
	updated_at: number;
	phone: string | null;
	auth_provider_id: string | null;
	email_verified: 0 | 1;
	phone_verified: 0 | 1;
	lang: 'en' | 'es' | 'it';
	last_message: MessageType;
};

export type AuthContextType = {
	loggedInUser: LoggedInUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	isBusy: boolean;
	setIsBusy: React.Dispatch<React.SetStateAction<boolean>>;

	login: (username: string, password: string) => Promise<any>;
	loginUsing2FA: (token: string, code: string) => Promise<any>;
	logout: () => Promise<void>;
	triggerLoggedInUserRefresh: () => Promise<void>;
	triggerRefreshToken: () => Promise<void>;

	apiClient: APIClient;
	socket: SocketClient;
};
