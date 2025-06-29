/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { motion } from "framer-motion";
import FriendsPanel from "../components/Main/FriendsPanel";
import Performance from "./components/Performance";
import GamesHistory from "./components/GamesHistory";
import UserPanel from "./components/UserPanel";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/(auth)/components/Loading";

export default function Me() {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated)
			router.replace('/login');
	}, [isLoading, isAuthenticated]);

	if (isLoading) {
		return (
			<main className="pt-30 flex h-[100vh] w-full pb-10 justify-center items-center">
				<LoadingSpinner />
			</main>
		);
	}

	return (
		<motion.main
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 0.5 }}
			className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6"
		>
			<div className="flex h-full w-full gap-6 rounded-lg">
				<article className="flex-5 flex h-full w-full flex-col gap-4">
					<UserPanel />
					<div
						className="hide-scrollbar flex flex-1 flex-col space-x-4
							space-y-4 overflow-scroll overflow-x-hidden lg:flex-row lg:space-y-0"
					>
						<Performance />
						<GamesHistory />
					</div>
				</article>
				<FriendsPanel />
			</div>
		</motion.main>
	);
}
