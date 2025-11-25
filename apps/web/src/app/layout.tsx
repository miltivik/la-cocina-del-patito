import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
import Providers from "@/components/providers";
import { NavigationDock } from "@/components/ui/demo";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "la-cocina-del-patito",
	description: "la-cocina-del-patito",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<div className="relative min-h-screen">
						<div className="absolute top-0 left-0 w-full z-50">
							<NavigationDock />
						</div>
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
