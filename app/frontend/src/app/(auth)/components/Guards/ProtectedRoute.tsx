"use client";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading, triggerRefreshToken, triggerLoggedInUserRefresh, socket } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!socket) return;

		async function handleUpdate(event: { eventType: string, data: Record<string, any> }) {
			console.group('/********** USER UPDATE **********/');

			console.log("EVENT: ", event);

			if (event.eventType !== 'USER_UPDATE' && event.data.status === 'REFRESH_REQUIRED')
				await triggerLoggedInUserRefresh();
			else if (event.eventType !== 'SESSION_UPDATE' && event.data.status === 'REFRESH_REQUIRED')
				await triggerRefreshToken();

			console.groupEnd();
		}

		socket.on('user', handleUpdate);

		return () => {
			socket.off('user', handleUpdate);
		};
	}, []);

	useEffect(() => {
		console.group("ProtectedRouteAuthGuard");
		console.log("isLoading?", isLoading, "isAuthenticated?", isAuthenticated);
		console.groupEnd();
		if (!isLoading && !isAuthenticated) router.replace("/login");
	}, [isLoading, isAuthenticated]);

	if (isLoading || !isAuthenticated) return null;

	return <>{children}</>;
}
