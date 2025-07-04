/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProgressBar from "./ProgressBar";

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
		return ( <ProgressBar complete={authFinished}/> );
	}

	return (
		<>
			<h1>{'<PublicRoute />'}</h1>
			{ children }
		</>
	);
}
