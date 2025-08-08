import React from "react";
import OutlineButton from "./ui/OutlineButton";
import FilledButton from "./ui/FilledButton";
import { XIcon } from "@phosphor-icons/react";
import { NOTIFICATION_TYPE } from "../types/notifications.types";

interface Props {
	isValid: boolean;
	type: NOTIFICATION_TYPE;
	handleAccept:(type: NOTIFICATION_TYPE) => void
	handleDecline:(type: NOTIFICATION_TYPE) => void
}

const GameOrTournament = ({handleAccept, handleDecline, isValid, type }: Props) => {
	function getText(type: string) {
		switch (type) {
			case "game":
				return "Game";
			case "tournament":
				return "Tournament";
		}
	}

	return (
		<>
			{!isValid && (
				<div className="ml-10 flex gap-2">
					<FilledButton onClick={() => handleAccept(type)}>Join {getText(type)}</FilledButton>
					<OutlineButton onClick={() => handleDecline(type)}>
						<XIcon size={16} />
					</OutlineButton>
				</div>
			)}
		</>
	);
};

export default GameOrTournament;
