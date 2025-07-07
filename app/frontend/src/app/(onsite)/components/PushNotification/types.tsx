import { Chats, GameController, UserPlus } from "@phosphor-icons/react";

const classContent = "absolute -top-10 right-10 opacity-5";
const iconSize = 160;

const friend_request = {
	title: "sent you a friend request!",
	icon: <UserPlus className={classContent} size={iconSize} />,
} as const;

const game = {
	title: "challenged you to a game!",
	icon: <GameController className={classContent} size={iconSize} />,
} as const;

const chat = {
	title: "sent you a message.",
	icon: <Chats className={classContent} size={iconSize} />,
} as const;

const types = {
	friend_request,
	game,
	chat,
} as const;

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

export type notifType = {
	id: string;
	image: string;
	username: string;
	type: "game" | "friend_request" | "chat";
};

export default types;
