/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading, triggerRefreshToken, socket } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!socket)
			return ;

		async function handleSessionUpdate(event: { eventType: string, data: Record<string, any> }) {
			console.group('/********** SESSION UPDATE **********/');

			console.log('EVENT: ', event);

			if (event.eventType !== 'SESSION_UPDATE')
				return ;

			if (event.data.status === 'REFRESH_REQUIRED')
				await triggerRefreshToken();

			console.groupEnd();
		}

		socket.on('user', handleSessionUpdate);

		return () => {
			socket.off('user', handleSessionUpdate);
		};
	}, []);

	useEffect(() => {
		console.group('ProtectedRouteAuthGuard');
		console.log('isLoading?', isLoading, 'isAuthenticated?', isAuthenticated);
		console.groupEnd();
		if (!isLoading && !isAuthenticated)
			router.replace('/login');
	}, [isLoading, isAuthenticated]);

	if (isLoading || !isAuthenticated)
		return null;

	return (
		<>
			{ children }
		</>
	);
}
