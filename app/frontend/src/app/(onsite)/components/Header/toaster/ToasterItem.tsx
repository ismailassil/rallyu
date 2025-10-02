import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TOAST_PAYLOAD, ToastTypesDetails } from "./Toast.types";
import { useNotification } from "../notification/context/NotificationContext";
import { useTranslations } from "next-intl";
import Avatar from "@/app/(onsite)/(profile)/users/components/Avatar";

interface Props {
	data: TOAST_PAYLOAD;
	time: number;
}

function ToasterItem({ data, time: DEFAULT_TIME }: Props) {
	const { image, senderUsername, type } = data;
	const [progress, setProgress] = useState(100);
	const router = useRouter();
	const { handleRemove, handleAccept, handleDecline } = useNotification();
	const t = useTranslations("");

	useEffect(() => {
		const TIME = DEFAULT_TIME;
		const start = Date.now();
		const timer = setInterval(() => {
			const remaining = Date.now() - start;
			const percentage = Math.max(0, 100 - (remaining / TIME) * 100);
			setProgress(percentage);
			if (remaining >= TIME) {
				clearInterval(timer);
			}
		}, 100);

		return () => {
			clearInterval(timer);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function handleChat() {
		handleRemove(data.id);
		router.push("/chat/" + senderUsername);
	}

	return (
		<div className="items-between absolute flex w-90 flex-col justify-center overflow-hidden rounded-lg bg-black/30 ring-1 ring-white/15 backdrop-blur-lg">
			<div className="flex h-18 items-center justify-between px-4">
				<div
					className="bg-main absolute top-0 left-0 h-0.5 w-full transition-all"
					style={{ width: `${progress}%` }}
				/>
				<div className="relative flex items-center gap-5 select-none">
					<Avatar
						avatar={image}
						className="flex h-12 w-12 overflow-hidden rounded-full ring-1 ring-white/30"
					/>
					<div>
						<p className="font-bold">{senderUsername}</p>
						<p className="text-sm">{t("headers.notification.box.description." + type)}</p>
					</div>
				</div>
				{ToastTypesDetails[type].icon}
			</div>
			{type === "status" ? null : type !== "chat" ? (
				<div className="*:transition-color flex h-8 justify-between divide-x divide-white/20 border-t-1 border-t-white/20 text-sm *:cursor-pointer *:duration-400">
					<button
						className="hover:bg-main w-full"
						onClick={() => handleAccept(data, true)}
					>
						{t("states.accept")}
					</button>
					<button
						className="w-full hover:bg-red-600"
						onClick={() => handleDecline(data, true)}
					>
						{t("states.decline")}
					</button>
				</div>
			) : (
				<button
					className="transition-color flex h-8 w-full cursor-pointer items-center justify-center divide-x divide-white/20 border-t-1 border-t-white/20 text-sm duration-400 hover:bg-white/10"
					onClick={handleChat}
				>
					{t("states.reply")}
				</button>
			)}
		</div>
	);
}

export default ToasterItem;
