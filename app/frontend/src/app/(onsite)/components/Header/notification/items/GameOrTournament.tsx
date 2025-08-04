import React, { useCallback } from "react";
import OutlineButton from "./ui/OutlineButton";
import FilledButton from "./ui/FilledButton";
import { XIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";

interface Props {
	isValid: boolean;
	type: string;
	actionUrl?: string;
}

const GameOrTournament = ({ isValid, type, actionUrl }: Props) => {
	const { api } = useAuth();
	const router = useRouter();

	function getText(type: string) {
		switch (type) {
			case "game":
				return "Game";
			case "tournament":
				return "Tournament";
		}
	}

	const handleAccept = useCallback(async () => {
		if (!actionUrl || actionUrl.length === 0) return;
		if (type === "game") {
			return router.push(actionUrl);
		}
		await api.instance
			.post(actionUrl + "?status=accept")
			.then(() => {
				console.log("ACCEPTED DONE");
			})
			.catch((err) => {
				console.error(err);
			});
	}, [actionUrl, api.instance, router, type]);

	const handleDecline = useCallback(async () => {
		if (!actionUrl || actionUrl.length === 0) return;
		if (type === "game") {
			return router.push(actionUrl);
		}
		await api.instance
			.post(actionUrl + "?status=decline")
			.then(() => {
				console.log("DECLINE DONE");
			})
			.catch((err) => {
				console.error(err);
			});
	}, [actionUrl, api.instance, router, type]);

	return (
		<>
			{!isValid && (
				<div className="ml-10 flex gap-2">
					<FilledButton onClick={handleAccept}>Join {getText(type)}</FilledButton>
					<OutlineButton onClick={handleDecline}>
						<XIcon size={16} />
					</OutlineButton>
				</div>
			)}
		</>
	);
};

export default GameOrTournament;
