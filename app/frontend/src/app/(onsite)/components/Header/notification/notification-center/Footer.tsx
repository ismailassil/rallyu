import { ChecksIcon } from "@phosphor-icons/react";
import React, { useCallback } from "react";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useTranslations } from "next-intl";

const Footer = () => {
	const { notifications } = useNotification();
	const { socket } = useAuth();
	const t = useTranslations("headers.notification.footer");

	const handleClearAll = useCallback(() => {
		const data = {
			eventType: "UPDATE_ACTION",
			data: {
				updateAll: true,
				status: "dismissed",
			},
		};

		socket.emit("notification", data);
	}, [socket]);

	const handleMarkAll = useCallback(() => {
		const data = {
			eventType: "UPDATE_ACTION",
			data: {
				updateAll: true,
				status: "read",
			},
		};

		socket.emit("notification", data);
	}, [socket]);

	return (
		<>
			{notifications.length >= 1 && (
				<div className="bg-card top-0 z-20 flex w-full justify-between px-4 py-3 text-start *:transition-all *:duration-300 *:hover:text-gray-300">
					<button
						className="flex cursor-pointer items-end gap-1.5 text-xs hover:underline"
						onClick={handleMarkAll}
					>
						<ChecksIcon size={18} />
						{t("asread")}
					</button>
					<button
						className="flex cursor-pointer items-end gap-2 text-xs hover:underline"
						onClick={handleClearAll}
					>
						{t("clear")}
					</button>
				</div>
			)}
		</>
	);
};

export default Footer;
