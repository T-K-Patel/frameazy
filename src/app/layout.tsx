import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Poppins } from "next/font/google";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/layout/Navbar";
import ContextProviders from "@/context/ContextProviders";
import Footer from "@/components/layout/Footer";

const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		template: "%s | Frameazy",
		absolute: "Frameazy | You Choose, We deliver",
		default: "Frameazy | You Choose, We deliver",
	},
	description: "Customise your own frames with Frameazy. We deliver your dream frames to your doorstep.",
	keywords: [
		"frameazy",
		"frames",
		"custom frames",
		"customise frames",
		"customise",
		"custom",
		"frame",
		"frames",
		"frameazy frames",
		"frameazy custom frames",
		"frameazy customise frames",
		"frameazy custom",
		"frameazy frame",
	],
};
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={poppins.className}>
				<div className="_next">
					<ContextProviders>
						<Navbar />
						{children}
						<ToastContainer position="bottom-right" theme="colored" />
						<Footer />
					</ContextProviders>
				</div>
				{process.env.NODE_ENV == "production" && (
					<>
						{" "}
						<Analytics />
						<SpeedInsights />
					</>
				)}
			</body>
		</html>
	);
}
