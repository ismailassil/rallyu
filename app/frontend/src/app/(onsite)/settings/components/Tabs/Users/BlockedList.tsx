import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import React, { useEffect } from "react";
import UserList from "./UserList";
import { X } from "lucide-react";
import useAPICall from "@/app/hooks/useAPICall";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import LoadingComponent, {
	PlaceholderComponent,
} from "@/app/(auth)/components/UI/LoadingComponents";
import useAPIQuery from "@/app/hooks/useAPIQuery";
import { useTranslations } from "next-intl";

export default function BlockedList() {
	const t = useTranslations("placeholders.data.blocked");

	const { loggedInUser, apiClient, socket } = useAuth();

	const {
		isLoading,
		error,
		data: blocked,
		refetch,
	} = useAPIQuery(() => apiClient.user.fetchBlocked());

	const { executeAPICall } = useAPICall();

	useEffect(() => {
		function handleRelationUpdate(event: { eventType: string; data: Record<string, any> }) {
			if (!socket || !loggedInUser)
				return;
			if (
				event.eventType === "RELATION_UPDATE" &&
				(event.data.requesterId === loggedInUser.id ||
				event.data.receiverId === loggedInUser.id) &&
				(event.data.status === 'BLOCKED' ||
				event.data.status === 'NONE')
			) refetch();
		}

		socket.on("user", handleRelationUpdate);
		return () => {
			socket.off("user", handleRelationUpdate);
		};
	}, [socket]);

	async function handleUnblock(id: number) {
		try {
			await executeAPICall(() => apiClient.unblockUser(id));
			toastSuccess("Unblocked");
		} catch (err: any) {
			toastError(err.message);
		}
	}

	const showSkeleton = isLoading && !blocked;

	if (showSkeleton) return <LoadingComponent />;

	if (error) return <PlaceholderComponent content={t("error")} />;

	if (!blocked || blocked.length === 0) return <PlaceholderComponent content={t("no-data")} />;

	return (
		<UserList
			users={blocked}
			actions={[
				{
					icon: (
						<X size={22} className="transition-all duration-300 hover:text-red-400" />
					),
					onClick: handleUnblock,
					title: "Unblock",
				},
			]}
		/>
	);
}
