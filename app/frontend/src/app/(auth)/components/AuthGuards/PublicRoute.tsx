/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && isAuthenticated)
			router.replace('/dashboard');
	}, [isLoading, isAuthenticated]);

	if (isLoading || isAuthenticated)
		return null;

	return (
		<>
			<h1 className="fixed top-0 left-90">{'<PublicRoute />'}</h1>
			{ children }
		</>
	);
}
