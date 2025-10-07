import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useHeaderContext } from "../../context/HeaderContext";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import {
	USER_NOTIFICATION,
	UPDATE_NOTIFICATION_DATA,
	NOTIFICATION_CONTEXT,
	HistoryPayload,
} from "../types/notifications.types";
import { TOAST_PAYLOAD } from "../../toaster/Toast.types";
import { useRouter } from "next/navigation";

// Create the Context
export const NotifContext = createContext<NOTIFICATION_CONTEXT | undefined>(undefined);

// Create a custom hook
export function useNotification() {
	const context = useContext(NotifContext);

	if (context === undefined) {
		throw new Error("useNotification must be used within a NotificationProvider");
	}

	return context;
}

function getToastData(data: USER_NOTIFICATION): TOAST_PAYLOAD {
	console.log("Creating toast for notification:", data);
	return {
		id: data.id,
		image: data.avatar,
		senderUsername: data.senderUsername,
		senderId: data.senderId,
		type: data.type,
		actionUrl: data.actionUrl ?? "",
		state: data.state,
	};
}

export function NotificationProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const DEFAULT_TIME = 3 * 1000;

	const [notifications, setNotifications] = useState<USER_NOTIFICATION[]>([]);
	const [toastNotifications, setToastNotifications] = useState<TOAST_PAYLOAD[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [notifLength, setNotifLength] = useState<number>(0);

	const { isNotif, isBottom, isProfile, isSearch } = useHeaderContext();
	const {
		apiClient,
		socket,
		loggedInUser
	} = useAuth();
	const router = useRouter();

	const isNotifRef = useRef<boolean>(isNotif);
	const pageRef = useRef(0);

	useEffect(() => {
		isNotifRef.current = isNotif;
	}, [isNotif]);

	const playSound = useCallback(() => {
		const sound = new Audio("/notification.mp3");
		sound.play().catch((e) => {
			console.log("Failed to play sound:", e);
		});
	}, []);

	const handleRemove = useCallback((id: number) => {
		setToastNotifications((prev) => prev.filter((notif) => notif.id !== id));
	}, []);

	const handleNotify = useCallback(
		(data: USER_NOTIFICATION) => {
			console.log(data);
			if (data.type === "chat" && window.location.pathname.startsWith("/chat")) {
				const payload: UPDATE_NOTIFICATION_DATA = {
					updateAll: false,
					notificationId: data.id,
					status: "dismissed",
					state: "finished",
				};
				socket.emit("notification_update_action", payload);
				return;
			}
			setNotifications((prev) => [data, ...prev]);

			if (!isNotifRef.current) {
				setToastNotifications((prev) => {
					const trimmed = prev.length >= 4 ? prev.slice(1) : prev;
					return [...trimmed, getToastData(data)];
				});

				playSound();

				setTimeout(() => handleRemove(data.id), 3000);
			}
		},
		[handleRemove, playSound, socket]
	);

	const handleUpdate = useCallback((payload: UPDATE_NOTIFICATION_DATA) => {
		const { updateAll, status, state } = payload;

		setNotifications((prev) => {
			if (!updateAll) {
				const { notificationId } = payload;

				if (status === "dismissed") {
					return prev.filter((notif) => notificationId !== notif.id);
				}
				return prev.map((notif) =>
					notif.id === notificationId ? { ...notif, status, state } : notif
				);
			}
			if (status === "dismissed") return [];
			return prev.map((notif) => ({ ...notif, status, state }));
		});
	}, []);

	useEffect(() => {
		socket.on("notification_notify", handleNotify);
		socket.on("notification_update_action", handleUpdate);

		return () => {
			socket.off("notification_notify", handleNotify);
			socket.off("notification_update_action", handleUpdate);
		};
	}, [handleNotify, handleUpdate, socket]);

	useEffect(() => {
		if (!isBottom && pageRef.current > 0) return;

		pageRef.current += 1;
		setIsLoading(true);

		apiClient.instance
			.get<HistoryPayload>(`/notif/history?page=${pageRef.current}`)
			.then((response) => {
				setNotifications((prev) => [...prev, ...response.data.message]);
				console.log(response.data.message);
			})
			.catch((err) => console.log(err))
			.finally(() => setIsLoading(false));
	}, [isBottom, apiClient]);

	useEffect(() => {
		let length = 0;
		notifications.map((notif) => {
			if (notif.status === "unread") length++;
		});

		setNotifLength(length);
	}, [notifications]);

	useEffect(() => {
		if (isNotif || isProfile || isSearch) {
			setToastNotifications([]);
		}
	}, [isNotif, isProfile, isSearch]);

	const handleAccept = useCallback(
		async (data: USER_NOTIFICATION | TOAST_PAYLOAD, isToast: boolean) => {
			const { id: notifId, actionUrl, senderId, type } = data;

			if (isToast) {
				handleRemove(notifId);
			}
			try {
				if (type === "friend_request") {
					await apiClient.acceptFriendRequest(senderId);
				} else if (type === "game") {
					const payload = {
						senderId: data.senderId,
						receiverId: loggedInUser?.id,
						stateAction: "accept",
						status: "read",
					};
					socket.emit("notification_update_game", payload);
				} else if (type === "tournament") {
					const payload: UPDATE_NOTIFICATION_DATA = {
						notificationId: data.id,
						updateAll: false,
						status: "read",
						state: "finished",
					};
					socket.emit("notification_update_action", payload);
					router.push(actionUrl || "/tournament");
				}
			} catch (err) {
				console.error(err);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[apiClient, handleRemove, router, socket]
	);

	const handleDecline = useCallback(
		async (data: USER_NOTIFICATION | TOAST_PAYLOAD, isToast: boolean) => {
			const { id: notifId, senderId, type } = data;

			if (isToast) {
				handleRemove(notifId);
			}
			try {
				if (type === "friend_request") {
					await apiClient.rejectFriendRequest(senderId);
				} else if (type === "game") {
					const payload = {
						senderId: data.senderId,
						receiverId: loggedInUser?.id,
						stateAction: "decline",
						status: "dismissed",
						actionUrl: data.actionUrl
					};
					socket.emit("notification_update_game", payload);
				} else if (type === "tournament") {
					const payload: UPDATE_NOTIFICATION_DATA = {
						notificationId: data.id,
						updateAll: false,
						status: "read",
						state: "finished",
					};
					socket.emit("notification_update_action", payload);
				}
			} catch (err) {
				console.error(err);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[apiClient, handleRemove, socket]
	);

	const values = useMemo<NOTIFICATION_CONTEXT>(
		() => ({
			notifications,
			setNotifications,
			toastNotifications,
			setToastNotifications,
			handleRemove,
			handleAccept,
			handleDecline,
			isLoading,
			notifLength,
			DEFAULT_TIME,
		}),
		[
			DEFAULT_TIME,
			handleAccept,
			handleDecline,
			handleRemove,
			isLoading,
			notifLength,
			notifications,
			toastNotifications,
		]
	);

	return <NotifContext.Provider value={values}>{children}</NotifContext.Provider>;
}
