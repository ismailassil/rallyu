import { MotionProps } from "framer-motion";

export type NotifType = "game" | "chat" | "friend_request";
export type statusType = "unread" | "read" | "dismissed";

export interface InnerNotifProps extends MotionProps {
	name: string;
	message: string;
	image: string;
	type: NotifType;
	status: statusType;
	date: number;
}

export const getTextDescription = (type: NotifType) => {
	switch (type) {
		case "game":
			return "challenged you to a game!";
		case "friend_request":
			return "sent you a friend request!";
		case "chat":
			return "sent you a message.";
	}
};
