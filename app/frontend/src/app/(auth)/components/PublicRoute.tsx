/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	// useEffect(() => {
	// 	console.log('useEffect in a PublicRoute');
	// 	console.log('isAuthenticated: ', isAuthenticated);
	// 	console.log('isLoading: ', isLoading);

	// 	if (!isLoading && isAuthenticated) {
	// 		router.replace('/dashboard');
	// 	}
	// }, [isLoading, isAuthenticated]);

	// const authFinished = !isLoading;

	// if (!authFinished) {
	// 	return ( <AuthLoadingSpinner /> );
	// }

	useEffect(() => {
		if (!isLoading && isAuthenticated)
			router.replace('/dashboard');
	}, [isLoading, isAuthenticated]);

	if (isLoading) {
		console.log('Showing loading spinner in PublicRoute');
		// return <LoadingPage />;
		return null;
	}
	if (isAuthenticated) {
		// return <LoadingPage />;
		return null;
	}

	console.log('PublicRoute: Not authenticated, showing children');
	return (
		<>
			<h1 className="fixed top-0 left-90">{'<PublicRoute />'}</h1>
			{ children }
		</>
	);
}
