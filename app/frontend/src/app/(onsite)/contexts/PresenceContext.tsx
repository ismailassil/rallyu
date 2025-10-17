'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from './AuthContext';

type PresenceContextType = {
	onlineUsers: Set<number>;
}

const PresenceContext = createContext<PresenceContextType | null>(null);

export function usePresence() {
	const ctx = useContext(PresenceContext);
	if (!ctx)
		throw new Error('usePresence must be used within an presence provider');
	return ctx;
}

export default function PresenceProvider({ children } : { children: ReactNode }) {
	const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
	const {
		socket
	} = useAuth();

	useEffect(() => {
		// console.log('presence ctx: socket: ', socket, 'isAuth', isAuthenticated);

		if (!socket)
			return ;

		function handlePresenceInitialState(payload: string[]) {
			console.log('presence initial state payload: ', payload);
			setOnlineUsers(new Set(payload.map(id => Number(id))));
		}

		function handleOnlineUpdate(payload: { userId: string }) {
			console.log('is online payload: ', payload);
			setOnlineUsers(prev => new Set([...prev, Number(payload.userId)]));
		}

		function handleOfflineUpdate(payload: { userId: string }) {
			console.log('is offline payload: ', payload);
			setOnlineUsers(prev => {
				const updated = new Set(prev);
				updated.delete(Number(payload.userId));
				return updated;
			});
		}

		socket.on('online_users_list', handlePresenceInitialState);
		socket.on('is_online', handleOnlineUpdate);
		socket.on('is_offline', handleOfflineUpdate);
		socket.emit('request_online_users_list', {});

		return () => {
			socket.off('online_users_list', handlePresenceInitialState);
			socket.off('is_online', handleOnlineUpdate);
			socket.off('is_offline', handleOfflineUpdate);
		};
	}, [socket]);

	return (
		<PresenceContext.Provider value={{onlineUsers}}>
			{children}
		</PresenceContext.Provider>
	);
}
