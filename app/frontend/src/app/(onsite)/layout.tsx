"use client";

import "@/app/globals.css";
import Header from "./components/Header/Header";
import SideBar from "./components/Sidebar";
import Background from "./components/Background";
import ProtectedRoute from "../(auth)/components/ProtectedRoute";
import ToasterCenter from "./components/Header/Notification/Toaster/ToasterCenter";
import { NotificationProvider } from "./components/Header/Notification/context/NotifContext";
import { HeaderProvider } from "./components/Header/context/HeaderContext";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<Background />
			<ProtectedRoute>
				<h1 className="fixed top-0 left-60">MainLayout</h1>
				<HeaderProvider>
					<NotificationProvider>
						<Header />
						<ToasterCenter/>
					</NotificationProvider>
				</HeaderProvider>
				<div>
					<SideBar />
					{children}
				</div>
			</ProtectedRoute>
		</div>
	);
}
