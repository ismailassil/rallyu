import {
	ChatsIcon,
	CrownSimpleIcon,
	GameControllerIcon,
	UserPlusIcon,
} from "@phosphor-icons/react";
import { NOTIFICATION_STATE, NOTIFICATION_TYPE } from "../notification/types/notifications.types";
import { UserMinusIcon } from "lucide-react";

const classContent = `absolute -top-10 right-5 opacity-5 -z-1`;
const iconSize = 190;

const chat = {
	icon: <ChatsIcon className={classContent} size={iconSize} />,
} as const;

const game = {
	icon: <GameControllerIcon className={classContent} size={iconSize} />,
} as const;

const game_accept = {
	icon: <GameControllerIcon className={classContent} size={iconSize} />,
} as const;

const game_reject = {
	icon: <GameControllerIcon className={classContent} size={iconSize} />,
} as const;

const pp_game = {
	icon: <GameControllerIcon className={classContent} size={iconSize} />,
} as const;

const xo_game = {
	icon: <GameControllerIcon className={classContent} size={iconSize} />,
} as const;

const friend_request = {
	icon: <UserPlusIcon className={classContent} size={iconSize} />,
} as const;

const friend_accept = {
	icon: <UserPlusIcon className={classContent} size={iconSize} />,
} as const;

const friend_reject = {
	icon: <UserMinusIcon className={classContent} size={iconSize} />,
} as const;

const friend_cancel = {
	icon: <UserMinusIcon className={classContent} size={iconSize} />,
} as const;

const tournament = {
	icon: <CrownSimpleIcon className={classContent} size={iconSize} />,
} as const;

export const ToastTypesDetails = {
	friend_request,
	game,
	chat,
	tournament,
	game_accept,
	game_reject,
	pp_game,
	xo_game,
	friend_accept,
	friend_reject,
	friend_cancel,
} as const;

export type TOAST_PAYLOAD = {
	id: number;
	image: string;
	senderUsername: string;
	senderId: number;
	type: NOTIFICATION_TYPE;
	actionUrl: string;
	state: NOTIFICATION_STATE;
};

export const decisionOptions = ["game", "tournament", "pp_game", "xo_game", "friend_request"];
