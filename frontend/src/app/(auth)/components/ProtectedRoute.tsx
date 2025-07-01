/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "./Loading";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		console.log('useEffect in a ProtectedRoute');
		console.log('isAuthenticated: ', isAuthenticated);
		console.log('isLoading: ', isLoading);

		if (!isLoading && !isAuthenticated) {
			router.replace('/login');
		}
	}, [isLoading, isAuthenticated]);

	if (isLoading || !isAuthenticated) {
		return (
			<main className="pt-30 flex h-[100vh] w-full pb-10 justify-center items-center">
				<h1>{'<ProtectedRoute />'}</h1>
				<LoadingSpinner />
			</main>
		);
	}

	return (
		<>
			<h1>{'<ProtectedRoute />'}</h1>
			{ children }
		</>
	);
}
