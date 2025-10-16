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
		if (!socket)
			return;

		function handlePresenceInitialState(payload: string[]) {
			setOnlineUsers(new Set(payload.map(id => Number(id))));
		}

		function handleOnlineUpdate(payload: { userId: string }) {
			setOnlineUsers(prev => new Set([...prev, Number(payload.userId)]));
		}

		function handleOfflineUpdate(payload: { userId: string }) {
			setOnlineUsers(prev => {
				const updated = new Set(prev);
				updated.delete(Number(payload.userId));
				return updated;
			});
		}

		socket.on('online_users_list', handlePresenceInitialState);
		socket.on('is_online', handleOnlineUpdate);
		socket.on('is_offline', handleOfflineUpdate);

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
