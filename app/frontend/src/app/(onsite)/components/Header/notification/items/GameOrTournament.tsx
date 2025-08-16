import React from "react";
import OutlineButton from "./ui/OutlineButton";
import FilledButton from "./ui/FilledButton";
import { XIcon } from "@phosphor-icons/react";
import { NOTIFICATION_TYPE } from "../types/notifications.types";
import { useTranslations } from "next-intl";

interface Props {
	type: NOTIFICATION_TYPE;
	handleAccept: () => void;
	handleDecline: () => void;
}

const GameOrTournament = ({ handleAccept, handleDecline, type }: Props) => {
	const t = useTranslations("states");

	return (
		<div className="ml-10 flex gap-2">
			<FilledButton onClick={handleAccept}>{t("join", { type: type })}</FilledButton>
			<OutlineButton onClick={handleDecline}>
				<XIcon size={16} />
			</OutlineButton>
		</div>
	);
};

export default GameOrTournament;
