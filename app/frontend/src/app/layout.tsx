import type { Metadata } from "next";
import "./globals.css";
import dmSans from "./fonts/dmSans";
import AuthProvider from "./(onsite)/contexts/AuthContext";
import Script from "next/script";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import funnelDisplay from "./fonts/FunnelDisplay";
import BackgroundManager from "./components/BackgroundManager";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: "Rallyu",
	description: "Play fast-paced online ping pong battles!",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang="en">
			<Script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js" />
			<body className={`${dmSans.className} ${funnelDisplay.variable} relative antialiased`}>
				<NextIntlClientProvider messages={messages} locale={locale}>
					<Toaster position='bottom-right' visibleToasts={1} />
					<AuthProvider>
						<BackgroundManager />
						{children}
					</AuthProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
