import React, { useEffect, useRef } from "react";
import { BellSimpleSlashIcon } from "@phosphor-icons/react";
import NotificationHeader from "./NotificationHeader";
import NotificationFooter from "./NotificationFooter";
import { AnimatePresence } from "framer-motion";
import { useNotification } from "../context/NotifContext";
import NotificationCard from "../NotificationCard";
import { useHeaderContext } from "../../context/HeaderContext";
import Loading from "./Loading";

const NotificationBox = () => {
	const { notifications, isLoading, notifLength } = useNotification();
	const boxRef = useRef<HTMLUListElement>(null);
	const { isNotif, setIsBottom } = useHeaderContext();

	useEffect(() => {
		if (!isNotif || !boxRef.current) return;

		const container = boxRef.current;
		container.scrollTop = 0;

		function handleScroll() {
			const isNearBottom =
				container.clientHeight + container.scrollTop >= container.scrollHeight - 10;

			setIsBottom(isNearBottom);
		}
		container.addEventListener("scroll", handleScroll);

		return () => {
			container.removeEventListener("scroll", handleScroll);
		};
	}, [isNotif, setIsBottom]);

	return (
		<>
			<NotificationHeader length={notifLength} />
			{isLoading ? (
				<Loading />
			) : (
				<ul
					className="hide-scrollbar divide-y-1 divide-bg flex-1 overflow-y-scroll"
					ref={boxRef}
				>
					{notifications.length >= 1 ? (
						<AnimatePresence>
							{notifications.map((notif, i) => {
								return (
									<NotificationCard
										key={i}
										id={notif.id}
										name={notif.from_user}
										// image={notif.image}
										image={"/profile/image_1.jpg"}
										message={notif.message}
										type={notif.type}
										status={notif.status}
										date={notif.updated_at}
									/>
								);
							})}
						</AnimatePresence>
					) : (
						<div className="flex flex-col items-center gap-3 py-20">
							<BellSimpleSlashIcon size={52} />
							<span className="text-sm">No Current Notifications</span>
						</div>
					)}
				</ul>
			)}
			<NotificationFooter />
		</>
	);
};

export default NotificationBox;
