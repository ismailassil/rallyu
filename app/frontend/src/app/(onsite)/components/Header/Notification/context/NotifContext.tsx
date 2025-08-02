import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { ToastType } from '../types/Toaster.types';
import { useHeaderContext } from '../../context/HeaderContext';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { NotificationPayload, 
	UpdateNotificationPayload, 
	NotifContextTypes, 
	HistoryPayload
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

function getToastData(data: NotificationPayload): ToastType {
	return {
		id: data.id.toString(),
		image: '/profile/image_2.jpg',
		username: data.senderUsername,
		type: data.type,
		action_url: data.actionUrl ?? '',
	};
}

export function NotificationProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const DEFAULT_TIME = 3 * 1000;

	const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
	const [toastNotifications, setToastNotifications] = useState<ToastType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [notifLength, setNotifLength] = useState<number>(0);

	const { isNotif, isBottom } = useHeaderContext();
	const { api, socket } = useAuth();
	
	const isNotifRef = useRef<boolean>(isNotif);
	const pageRef = useRef(0);

	useEffect(() => {
		isNotifRef.current = isNotif;
	}, [isNotif]);

	const playSound = useCallback(() => {
		const sound = new Audio('/notification.mp3');
		sound.play().catch((e) => {
			console.log('Failed to play sound:', e);
		});
	}, []);

	const handleRemove = useCallback((id: string) => {
		setToastNotifications((prev) => prev.filter((notif) => notif.id !== id));
	}, []);


	const handleNotify = useCallback(
		(data: NotificationPayload) => {
			setNotifications((prev) => [data, ...prev]);

			if (!isNotifRef.current) {
				setToastNotifications((prev) => {
					const trimmed = prev.length >= 4 ? prev.slice(1) : prev;
					return [...trimmed, getToastData(data)];
				});

				playSound();

				setTimeout(() => handleRemove(data.id.toString()), 3000);
			}
		},
		[handleRemove, playSound],
	);

	const handleUpdate = useCallback((payload: UpdateNotificationPayload) => {
		const { scope, status, notificationId } = payload;

		setNotifications((prev) => {
			if (scope === 'single') {
				return prev.map((notif) => (
					notif.id === notificationId ? {...notif, status}: notif
				));
			}
			if (status === 'dismissed') return [];
			return prev.map((notif) => ({...notif, status: status}));
		});
	}, []);

	useEffect(() => {

		socket.on('notification_notify', handleNotify);
		socket.on('notification_update', handleUpdate);
		
		return () => {
			socket.off('notification_notify', handleNotify);
			socket.off('notification_update', handleUpdate);
		};
		
	}, [handleNotify, handleUpdate, socket]);

	useEffect(() => {
		if (!isBottom && pageRef.current > 0) return;

		console.log('Getting New Notifications: ' + pageRef.current);
		pageRef.current += 1;
		setIsLoading(true);

		api.instance
			.get<HistoryPayload>(
				`/notif/history?page=${pageRef.current}`,
			)
			.then((response) => {
				setNotifications((prev) => [...prev, ...response.data.message]);
				console.log(response.data.message);
			})
			.catch((err) => console.log(err))
			.finally(() => setIsLoading(false));
		
	}, [isBottom, api]);

	useEffect(() => {
		let length = 0;
		notifications.map((notif) => {
			if (notif.status === 'unread') length++;
		});

		setNotifLength(length);
	}, [notifications]);

	const values = useMemo<NotifContextTypes>(() => ({
		notifications,
		setNotifications,
		toastNotifications,
		setToastNotifications,
		handleRemove,
		isLoading,
		notifLength,
		DEFAULT_TIME,
	}), [DEFAULT_TIME, handleRemove, isLoading, notifLength, notifications, toastNotifications]);

	return (
		<NotifContext.Provider value={values}>
			{children}
		</NotifContext.Provider>
	);
}
