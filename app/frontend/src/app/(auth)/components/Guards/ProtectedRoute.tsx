/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
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
