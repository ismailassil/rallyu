import {
	ChatsIcon,
	CrownSimpleIcon,
	GameControllerIcon,
	InfoIcon,
	UserPlusIcon,
} from "@phosphor-icons/react";
import { NOTIFICATION_STATE, NOTIFICATION_TYPE } from "../notification/types/notifications.types";
import { getTextDescription } from "../notification/notification-center/NotificationCard";

const classContent = `absolute -top-10 right-5 opacity-5 -z-1`;
const iconSize = 190;

const friend_request = {
	title: getTextDescription("friend_request"),
	icon: <UserPlusIcon className={classContent} size={iconSize} />,
} as const;

const game = {
	title: getTextDescription("game"),
	icon: <GameControllerIcon className={classContent} size={iconSize} />,
} as const;

const chat = {
	title: getTextDescription("chat"),
	icon: <ChatsIcon className={classContent} size={iconSize} />,
} as const;

const tournament = {
	title: getTextDescription("tournament"),
	icon: <CrownSimpleIcon className={classContent} size={iconSize} />,
} as const;

const status = {
	title: getTextDescription("status"),
	icon: <InfoIcon className={classContent} size={iconSize} />,
} as const;

export const ToastTypesDetails = {
	friend_request,
	game,
	chat,
	tournament,
	status,
} as const;

export type TOAST_PAYLOAD = {
	id: number;
	image: string;
	senderUsername: string;
	senderId: number;
	type: NOTIFICATION_TYPE;
	action_url: string;
	state: NOTIFICATION_STATE;
};
