import {
	createContext,
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { NotifType, statusType } from "../types/NotificationCard.types";
import axios from "axios";
import { ToastType } from "../types/Toaster.types";
import { io, Socket } from "socket.io-client";

interface NotifContextTypes {
	notifications: NotificationType[];
	setNotifications: Dispatch<SetStateAction<NotificationType[]>>;
	toastNotifications: ToastType[];
	setToastNotifications: Dispatch<SetStateAction<ToastType[]>>;
	handleRemove: (id: string) => void;
}

interface NotificationType {
	id: number;
	from_user: string;
	to_user: string;
	message: string;
	type: NotifType;
	created_at: string;
	updated_at: string;
	status: statusType;
	action_url: string;
}

interface HistoryType {
	status: "success" | "error";
	message: NotificationType[];
}

// Create the Context
export const NotifContext = createContext<NotifContextTypes | undefined>(undefined);

// Create a custom hook
export function useNotification() {
	const context = useContext(NotifContext);

	if (context === undefined) {
		throw new Error("useNotification must be used within a NotificationProvider");
	}

	return context;
}

function getToastData(data: NotificationType): ToastType {
	return {
		id: data.id.toString(),
		image: "/profile/image_2.jpg",
		username: data.from_user,
		type: data.type,
	};
}

export function NotificationProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const [notifications, setNotifications] = useState<NotificationType[]>([]);
	const [toastNotifications, setToastNotifications] = useState<ToastType[]>([]);
	const socketRef = useRef<Socket | null>(null);

	const playSound = useCallback(() => {
		const sound = new Audio("/notification.mp3");
		sound.play().catch((e) => {
			console.log("Failed to play sound:", e);
		});
	}, []);

	const handleRemove = useCallback((id: string) => {
		setToastNotifications((prev) => prev.filter((notif) => notif.id !== id));
	}, []);

	useEffect(() => {
		// TODO: Only used for Testing
		const vToken = "8)@zNX[3cZ:xfn_";
		const socket = io("http://localhost:4004", {
			extraHeaders: {
				token: vToken,
			},
		});

		socketRef.current = socket;

		socket.on("connect", () => {
			console.log(`Connected to Server with ID: ${socket.id}`);

			socket.emit("identify", { username: "iassil" });
		});

		socket.on("notify", (data: NotificationType) => {
			setNotifications((prev) => [...prev, data]);

			/// TODO: When the Notification Box is Open, DO NOT toast the notification
			setToastNotifications((prev) => {
				const timmed = prev.length >= 4 ? prev.slice(1) : prev;
				return [...timmed, getToastData(data)];
			});

			playSound();

			setTimeout(() => handleRemove(data.id.toString()), 1.5 * 1000);
		});
		return () => {
			socket.disconnect();
			console.log("Socket disconnected");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const page: string = "1";
		const username = "iassil";
		axios
			.get<HistoryType>(`http://localhost:4004/api/notif/history/${username}?page=${page}`)
			.then((response) => {
				setNotifications((prev) => [...prev, ...response.data.message]);
				console.log(response.data.message);
			});
	}, []);

	return (
		<NotifContext.Provider
			value={{
				notifications,
				setNotifications,
				toastNotifications,
				setToastNotifications,
				handleRemove,
			}}
		>
			{children}
		</NotifContext.Provider>
	);
}
