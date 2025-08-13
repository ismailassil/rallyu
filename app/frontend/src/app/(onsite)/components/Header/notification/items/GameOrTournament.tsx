import React from "react";
import OutlineButton from "./ui/OutlineButton";
import FilledButton from "./ui/FilledButton";
import { XIcon } from "@phosphor-icons/react";
import { NOTIFICATION_TYPE } from "../types/notifications.types";

interface Props {
	type: NOTIFICATION_TYPE;
	handleAccept: () => void;
	handleDecline: () => void;
}

const GameOrTournament = ({ handleAccept, handleDecline, type }: Props) => {
	function getText(type: string) {
		switch (type) {
			case "game":
				return "Game";
			case "tournament":
				return "Tournament";
		}
	}

	return (
		<div className="ml-10 flex gap-2">
			<FilledButton onClick={handleAccept}>Join {getText(type)}</FilledButton>
			<OutlineButton onClick={handleDecline}>
				<XIcon size={16} />
			</OutlineButton>
		</div>
	);
};

export default GameOrTournament;
