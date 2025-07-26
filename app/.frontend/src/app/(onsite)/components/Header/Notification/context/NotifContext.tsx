import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import axios from 'axios';
import { ToastType } from '../types/Toaster.types';
import { io, Socket } from 'socket.io-client';
import { useHeaderContext } from '../../context/HeaderContext';
import {
	HistoryType,
	IUpdateTypes,
	NotifContextTypes,
	NotificationType,
} from '../types/NotifContext.types';

// Create the Context
export const NotifContext = createContext<NotifContextTypes | undefined>(undefined);

// Create a custom hook
export function useNotification() {
	const context = useContext(NotifContext);

	if (context === undefined) {
		throw new Error(
			'useNotification must be used within a NotificationProvider',
		);
	}

	return context;
}

function getToastData(data: NotificationType): ToastType {
	return {
		id: data.id.toString(),
		image: '/profile/image_2.jpg',
		username: data.from_user,
		type: data.type,
		action_url: data.action_url
	};
}

export function NotificationProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const DEFAULT_TIME = 3 * 1000;
	const [notifications, setNotifications] = useState<NotificationType[]>([]);
	const [toastNotifications, setToastNotifications] = useState<ToastType[]>([]);
	const socketRef = useRef<Socket | null>(null);
	const { isNotif, isBottom } = useHeaderContext();
	const isNotifRef = useRef<boolean>(isNotif);
	const pageRef = useRef(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [notifLength, setNotifLength] = useState<number>(0);

	const playSound = useCallback(() => {
		const sound = new Audio('/notification.mp3');
		sound.play().catch((e) => {
			console.log('Failed to play sound:', e);
		});
	}, []);

	const handleRemove = useCallback((id: string) => {
		setToastNotifications((prev) => prev.filter((notif) => notif.id !== id));
	}, []);

	useEffect(() => {
		isNotifRef.current = isNotif;
	}, [isNotif]);

	const handleNotify = useCallback(
		(data: NotificationType) => {
			setNotifications((prev) => [data, ...prev]);

			if (!isNotifRef.current) {
				console.log(data);
				setToastNotifications((prev) => {
					const trimmed = prev.length >= 4 ? prev.slice(1) : prev;
					return [...trimmed, getToastData(data)];
				});

				playSound();

				setTimeout(() => handleRemove(data.id.toString()), 3000);
			}
		},
		[isNotifRef, handleRemove, playSound],
	);

	const handleUpdate = useCallback((payload: IUpdateTypes) => {
		const allOrId = payload.notifType;
		const notifStatus = payload.notifStatus;

		if (typeof allOrId === 'number') {
			setNotifications((prev) =>
				prev.map((notif) =>
					notif.id === allOrId ? { ...notif, status: notifStatus } : notif,
				),
			);
			return;
		}
		if (notifStatus === 'dismissed') setNotifications([]);
		else
			setNotifications((prev) =>
				prev.map((notif) => ({ ...notif, status: notifStatus })),
			);
	}, []);

	useEffect(() => {
		const vToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1lc2VyZ2hpIn0.LAsci5IRgXlmmtqr_ibhz2G6F0gCUpoQwQbW_AnrGKo';
		const socket = io('http://localhost:4004', {
			extraHeaders: {
				token: vToken,
			},
		});

		socketRef.current = socket;

		socket.on('connect', () => {
			console.log(`Connected to Server with ID: ${socket.id}`);
			socket.emit('identify', { username: 'iassil' });
		});

		socket.on('notify', handleNotify);

		socket.on('update', handleUpdate);

		return () => {
			socket.disconnect();
			console.log('Socket disconnected');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!isBottom && pageRef.current > 0) return;

		console.log('Getting New Notifications: ' + pageRef.current);
		pageRef.current += 1;

		setIsLoading(true);
		axios
			.get<HistoryType>(
				`http://localhost:4004/api/notif/history?page=${pageRef.current}`,
			)
			.then((response) => {
				setNotifications((prev) => [...prev, ...response.data.message]);
				console.log(response.data.message);
			})
			.catch((err) => console.log(err));
		setIsLoading(false);
	}, [isBottom]);

	useEffect(() => {
		let length = 0;
		notifications.map((notif) => {
			if (notif.status === 'unread') length++;
		});

		setNotifLength(length);
	}, [notifications]);

	return (
		<NotifContext.Provider
			value={{
				socketRef,
				notifications,
				setNotifications,
				toastNotifications,
				setToastNotifications,
				handleRemove,
				isLoading,
				notifLength,
				DEFAULT_TIME,
			}}
		>
			{children}
		</NotifContext.Provider>
	);
}
