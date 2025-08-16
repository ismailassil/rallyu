import React from "react";
import OutlineButton from "./ui/OutlineButton";
import FilledButton from "./ui/FilledButton";
import { useTranslations } from "next-intl";

const FriendRequest = ({
	handleAccept,
	handleDecline,
}: {
	handleAccept: () => void;
	handleDecline: () => void;
}) => {
	const t = useTranslations("states");

	return (
		<div className="ml-10 flex gap-2">
			<FilledButton onClick={handleAccept}>{t("accept")}</FilledButton>
			<OutlineButton onClick={handleDecline}>{t("decline")}</OutlineButton>
		</div>
	);
};

export default FriendRequest;
