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
	Notification,
	NotificationContext,
	HistoryPayload,
	ServerToClient,
	UpdateNotification,
	UpdateContext,
	UpdateAll,
} from "../types/notifications.types";
import { TOAST_PAYLOAD } from "../../toaster/Toast.types";
import { useRouter } from "next/navigation";
import { GameType } from "@/app/(onsite)/game/types/types";

// Create the Context
export const NotifContext = createContext<NotificationContext | undefined>(undefined);

// Create a custom hook
export function useNotification() {
	const context = useContext(NotifContext);

	if (context === undefined) {
		throw new Error("useNotification must be used within a NotificationProvider");
	}

	return context;
}

function getToastData(data: Notification): TOAST_PAYLOAD {
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

	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [toastNotifications, setToastNotifications] = useState<TOAST_PAYLOAD[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [notifLength, setNotifLength] = useState<number>(0);

	const { isNotif, isBottom, isProfile, isSearch } = useHeaderContext();
	const { apiClient, socket } = useAuth();
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

	const handleRemoveToast = useCallback((id: number) => {
		setToastNotifications((prev) => prev.filter((notif) => notif.id !== id));
	}, []);

	const handleNotify = useCallback(
		(data: Notification) => {
			console.log(data);
			if (data.type === "chat" && window.location.pathname.startsWith("/chat")) {
				const payload = {
					eventType: "UPDATE_ACTION",
					data: {
						updateAll: false,
						notificationId: data.id,
						status: "dismissed",
						state: "finished",
					},
				};
				socket.emit("notification", payload);
				return;
			}
			setNotifications((prev) => [data, ...prev]);

			if (!isNotifRef.current) {
				setToastNotifications((prev) => {
					const trimmed = prev.length >= 4 ? prev.slice(1) : prev;
					return [...trimmed, getToastData(data)];
				});

				playSound();

				setTimeout(() => handleRemoveToast(data.id), 3000);
			}
		},
		[handleRemoveToast, playSound, socket]
	);

	const handleUpdateAction = useCallback((payload: UpdateNotification) => {
		const { updateAll, status } = payload;

		setNotifications((prev) => {
			if (!updateAll) {
				const { notificationId, state } = payload;

				if (status === "dismissed") {
					setToastNotifications((prev) => {
						return prev.filter((toast) => toast.id !== notificationId);
					});
					return prev.filter((notif) => notificationId !== notif.id);
				}
				return prev.map((notif) =>
					notif.id === notificationId ? { ...notif, status, state } : notif
				);
			}
			if (status === "dismissed") {
				setToastNotifications([]);
				return [];
			}
			return prev.map((notif) => ({ ...notif, status }));
		});
	}, []);

	const handleUpdateContext = useCallback((payload: UpdateContext) => {
		const { type } = payload;

		setNotifications((prev) =>
			prev.filter((notif) => {
				if (notif.type !== type) return notif;
			})
		);
	}, []);

	const handleUpdateAll = useCallback((payload: UpdateAll) => {
		const { type, senderId, status } = payload;

		if (status !== "dismissed") return;
		setNotifications((prev) =>
			prev.filter((notif) => notif.senderId !== senderId || notif.type !== type)
		);
	}, []);

	const handleGame = useCallback(
		(payload: string) => {
			router.push("/game/" + payload);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const handleAccept = useCallback(
		async (data: Notification | TOAST_PAYLOAD, isToast: boolean) => {
			const { id: notifId, senderId, type } = data;

			if (isToast) {
				handleRemoveToast(notifId);
			}
			try {
				if (type === "friend_request") {
					await apiClient.acceptFriendRequest(senderId);
				} else if (type === "game" || type === "pp_game" || type === "xo_game") {
					console.log(data.actionUrl);
					socket.emitGameResponse(senderId, true, data.actionUrl!, type as GameType);
				} else if (type === "tournament") {
				}
			} catch (err) {
				console.error(err);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[handleRemoveToast, socket]
	);

	const handleDecline = useCallback(
		async (data: Notification | TOAST_PAYLOAD, isToast: boolean) => {
			const { id: notifId, senderId, type } = data;

			if (isToast) {
				handleRemoveToast(notifId);
			}
			try {
				if (type === "friend_request") {
					await apiClient.rejectFriendRequest(senderId);
				} else if (type === "game" || type === "pp_game" || type === "xo_game") {
					socket.emitGameResponse(senderId, false, data.actionUrl!, type as GameType);
				} else if (type === "tournament") {
				}
			} catch (err) {
				console.error(err);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[handleRemoveToast, socket]
	);

	const handleAll = useCallback(
		({ eventType, data }: ServerToClient) => {
			socket.printAll(data);
			switch (eventType) {
				case "NOTIFY":
					handleNotify(data);
					break;
				case "UPDATE_ACTION":
					handleUpdateAction(data);
					break;
				case "UPDATE_CONTEXT":
					handleUpdateContext(data);
					break;
				case "UPDATE_GAME":
					handleGame(data);
					break;
				case "UPDATE_ALL":
					handleUpdateAll(data);
					break;
				default:
					console.error(eventType);
			}
		},
		[handleGame, handleNotify, handleUpdateAction, handleUpdateAll, handleUpdateContext, socket]
	);

	useEffect(() => {
		socket.on("notification", handleAll);

		return () => {
			socket.off("notification", handleAll);
		};
	}, [handleAll, socket]);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isBottom]);

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

	const values = useMemo<NotificationContext>(
		() => ({
			notifications,
			setNotifications,
			toastNotifications,
			setToastNotifications,
			handleRemoveToast,
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
			handleRemoveToast,
			isLoading,
			notifLength,
			notifications,
			toastNotifications,
		]
	);

	return <NotifContext.Provider value={values}>{children}</NotifContext.Provider>;
}
