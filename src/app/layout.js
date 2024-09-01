// import { Inter } from "next/font/google";

import Providers from "./provider";
import "@/styles/globals.css";
import "@radix-ui/themes/styles.css";
import { ProtectRoute } from "@/components/layout/ProtectRoute";
import { ToastProvider } from "@/hooks/useToast";

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Globotix Fleet Management",
	description: "Globotix Fleet Management",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
					rel="stylesheet"></link>
			</head>
			<body style={{ fontFamily: "'Inter', sans-serif" }}>
				<ProtectRoute>
					<ToastProvider>
						<Providers>{children}</Providers>
					</ToastProvider>
				</ProtectRoute>
			</body>
		</html>
	);
}
