import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import React, { useEffect } from "react";
import UserList from "./UserList";
import { Check, X } from "lucide-react";
import useAPICall from "@/app/hooks/useAPICall";
import { toastError, toastSuccess } from "@/app/components/CustomToast";
import LoadingComponent, {
	PlaceholderComponent,
} from "@/app/(auth)/components/UI/LoadingComponents";
import useAPIQuery from "@/app/hooks/useAPIQuery";
import { useTranslations } from "next-intl";

export default function IncomingFriendRequestsList() {
	const t = useTranslations("placeholders.data.incoming");

	const { loggedInUser, apiClient, socket } = useAuth();

	const {
		isLoading,
		error,
		data: incoming,
		refetch,
	} = useAPIQuery(() => apiClient.user.fetchIncomingFriendRequests());

	const { executeAPICall } = useAPICall();

	useEffect(() => {
		function handleRelationUpdate(event: { eventType: string; data: Record<string, any> }) {
			if (!socket || !loggedInUser)
				return;
			if (
				event.eventType === "RELATION_UPDATE" &&
				(event.data.requesterId === loggedInUser.id ||
				event.data.receiverId === loggedInUser.id) &&
				(event.data.status === 'PENDING' ||
				event.data.status === 'NONE')
			) refetch();
		}

		socket.on("user", handleRelationUpdate);
		return () => {
			socket.off("user", handleRelationUpdate);
		};
	}, [socket]);

	async function handleDecline(id: number) {
		try {
			await executeAPICall(() => apiClient.rejectFriendRequest(id));
			toastSuccess("Rejected");
		} catch (err: any) {
			toastError(err.message);
		}
	}

	async function handleAccept(id: number) {
		try {
			await executeAPICall(() => apiClient.acceptFriendRequest(id));
			toastSuccess("Accepted");
		} catch (err: any) {
			toastError(err.message);
		}
	}

	const showSkeleton = isLoading && !incoming;

	if (showSkeleton) return <LoadingComponent />;

	if (error) return <PlaceholderComponent content={t("error")} />;

	if (!incoming || incoming.length === 0) return <PlaceholderComponent content={t("no-data")} />;

	return (
		<UserList
			users={incoming}
			actions={[
				{
					icon: (
						<Check
							size={22}
							className="transition-all duration-300 hover:text-blue-400"
						/>
					),
					onClick: handleAccept,
					title: "Accept",
				},
				{
					icon: (
						<X size={22} className="transition-all duration-300 hover:text-red-400" />
					),
					onClick: handleDecline,
					title: "Decline",
				},
			]}
		/>
	);
}
