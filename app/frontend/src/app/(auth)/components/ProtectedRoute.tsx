/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProgressBar from "./ProgressBar";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		console.log('useEffect in a ProtectedRoute');
		console.log('isAuthenticated: ', isAuthenticated);
		console.log('isLoading: ', isLoading);

		// if (!isLoading && !isAuthenticated) {
		// 	router.replace('/login');
		// }
	}, [isLoading, isAuthenticated]);

	const authFinished = !isLoading;

	// if (!authFinished || !isAuthenticated) {
	// 	return ( <ProgressBar complete={authFinished}/> );
	// }

	return (
		<>
			<h1 className="fixed top-0 left-90">{'<ProtectedRoute />'}</h1>
			{ children }
		</>
	);
}
