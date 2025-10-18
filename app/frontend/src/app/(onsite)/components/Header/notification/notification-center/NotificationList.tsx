import React, { useCallback, useEffect, useRef } from "react";
import { BellSimpleSlashIcon } from "@phosphor-icons/react";
import { AnimatePresence } from "framer-motion";
import { useNotification } from "../context/NotificationContext";
import NotificationCard from "./NotificationCard";
import { useHeaderContext } from "../../context/HeaderContext";
import Loading from "../items/ui/LoadingIndicator";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useTranslations } from "next-intl";

const NotificationList = () => {
	const { notifications, isLoading } = useNotification();
	const boxRef = useRef<HTMLUListElement>(null);
	const { isNotif, setIsBottom } = useHeaderContext();
	const { socket } = useAuth();
	const t = useTranslations("headers.notification.box");

	const handleScroll = useCallback(() => {
		if (!boxRef.current) return;
		const container = boxRef.current;
		const isNearBottom =
			container.clientHeight + container.scrollTop >= container.scrollHeight - 10;

		setIsBottom(isNearBottom);
	}, [setIsBottom]);

	useEffect(() => {
		if (!isNotif || !boxRef.current) return;

		const container = boxRef.current;
		container.scrollTop = 0;
		container.addEventListener("scroll", handleScroll);

		return () => {
			container.removeEventListener("scroll", handleScroll);
		};
	}, [isNotif, handleScroll]);

	function handleSingleUpdate(id: number, status: "read" | "dismissed", state: "pending" | "finished") {
		const data = {
			eventType: "UPDATE_ACTION",
			data: {
				updateAll: false,
				notificationId: id,
				status: status,
				state: state,
			}
		};

		socket.emit("notification", data);
	}

	if (isLoading) return <Loading />;

	return (
		<>
			{notifications.length >= 1 ? (
				<ul
					className="hide-scrollbar divide-bg flex-1 divide-y-1 overflow-y-scroll"
					ref={boxRef}
				>
					<AnimatePresence>
						{notifications.map((notif) => {
							return (
								<NotificationCard
									key={notif.id}
									data={notif}
									handler={handleSingleUpdate}
								/>
							);
						})}
					</AnimatePresence>
				</ul>
			) : (
				<div className="flex flex-col items-center gap-3 py-20">
					<BellSimpleSlashIcon size={52} />
					<span className="text-sm">{t("no_payload")}</span>
				</div>
			)}
		</>
	);
};

export default NotificationList;
