import { ChatsIcon, GameControllerIcon, UserPlusIcon } from "@phosphor-icons/react";

const classContent = "absolute -top-10 right-10 opacity-5 -z-1";
const iconSize = 160;

const friend_request = {
	title: "sent you a friend request!",
	icon: <UserPlusIcon className={classContent} size={iconSize} />,
} as const;

const game = {
	title: "challenged you to a game!",
	icon: <GameControllerIcon className={classContent} size={iconSize} />,
} as const;

const chat = {
	title: "sent you a message.",
	icon: <ChatsIcon className={classContent} size={iconSize} />,
} as const;

const types = {
	friend_request,
	game,
	chat,
} as const;

export interface PushNotifProps {
	image: string;
	username: string;
	type: "game" | "friend_request" | "chat";
	time: number;
	action_url: string;
}

export type notificationsType =
	| {
			id: string;
			image: string;
			username: string;
			type: "friend_request";
	  }
	| {
			id: string;
			image: string;
			username: string;
			type: "chat";
	  }
	| {
			id: string;
			image: string;
			username: string;
			type: "game";
	  };

export type ToastType = {
	id: string;
	image: string;
	username: string;
	type: "game" | "friend_request" | "chat";
	action_url: string;
};

export default types;
