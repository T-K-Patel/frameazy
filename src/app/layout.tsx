import { Poppins } from "next/font/google";
import "./globals.css";
import ContextProviders from "@/context/ContextProviders";
import { Metadata } from "next";
import Script from "next/script";

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Frameazy | You Choose, We deliver",
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
            <head>
                <Script src="https://checkout.razorpay.com/v1/checkout.js" async></Script>
            </head>
            <body className={poppins.className}>
                <div className="_next">
                    <ContextProviders>{children}</ContextProviders>
                </div>
            </body>
        </html>
    );
}
