import React from "react";
import { useNotification } from "../context/NotificationContext";
import { useTranslations } from "next-intl";

const Header = () => {
	const { notifLength: length } = useNotification();
	const t = useTranslations("headers.notification");

	return (
		<div className="bg-card flex w-full flex-col px-4 py-3 text-start">
			<p className="font-bold">{t("title")}</p>
			<p className="text-gray text-xs text-gray-400">{t("subtitle", { length })}</p>
		</div>
	);
};

export default Header;
