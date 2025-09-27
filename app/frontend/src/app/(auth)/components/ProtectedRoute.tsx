/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingPage } from "./LoadingSpinners";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated)
			router.replace('/login');
	}, [isLoading, isAuthenticated]);

	if (isLoading) {
		// return <LoadingPage />;
		return null;
	}
	if (!isAuthenticated) {
		// return <LoadingPage />;
		return null;
	}

	return (
		<>
			<h1 className="fixed top-0 left-90">{'<ProtectedRoute />'}</h1>
			{ children }
		</>
	);
}
