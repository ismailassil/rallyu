/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthLoadingSpinner } from "./LoadingSpinners";

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

	const authFinished = !isLoading;

	if (!authFinished) {
		return ( <AuthLoadingSpinner /> );
	}

	return (
		<>
			<h1 className="fixed top-0 left-90">{'<PublicRoute />'}</h1>
			{ children }
		</>
	);
}
