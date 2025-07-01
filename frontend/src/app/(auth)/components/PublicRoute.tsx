/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "./Loading";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		console.log('useEffect in a PublicRoute');
		console.log('isAuthenticated: ', isAuthenticated);
		console.log('isLoading: ', isLoading);

		if (!isLoading && isAuthenticated) {
			router.replace('/dashboard');
		}
	}, [isLoading, isAuthenticated]);

	if (isLoading) {
		return (
			<main className="pt-30 flex h-[100vh] w-full pb-10 justify-center items-center">
				<h1>{'<PublicRoute />'}</h1>
				<LoadingSpinner />
			</main>
		);
	}

	return (
		<>
			<h1>{'<PublicRoute />'}</h1>
			{ children }
		</>
	);
}
