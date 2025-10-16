"use client";
import "@/app/globals.css";
import Header from "./components/Header/Header";
import SideBar from "./components/Sidebar";
import ProtectedRoute from "../(auth)/components/Guards/ProtectedRoute";
import ToasterCenter from "./components/Header/toaster/ToasterCenter";
import { NotificationProvider } from "./components/Header/notification/context/NotificationContext";
import { HeaderProvider } from "./components/Header/context/HeaderContext";
import PresenceProvider from "./contexts/PresenceContext";

export default function OnsiteLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ProtectedRoute>
			<HeaderProvider>
				<NotificationProvider>
					<Header />
					<ToasterCenter />
				</NotificationProvider>
			</HeaderProvider>
			<PresenceProvider>
				<SideBar />
				{children}
			</PresenceProvider>
		</ProtectedRoute>
	);
}
