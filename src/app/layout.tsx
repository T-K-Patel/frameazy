import { Poppins } from "next/font/google";
import "./globals.css";
import ContextProviders from "@/context/ContextProviders";
import { Metadata } from "next";

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
        "frameazy frames",
        "frameazy frameazy",
        "frameazy frameazy frames",
        "frameazy frameazy custom frames",
        "frameazy frameazy customise frames",
        "frameazy frameazy custom",
        "frameazy frameazy frame",
        "frameazy frameazy frames",
        "frameazy frameazy",
        "frameazy frameazy frames",
        "frameazy frameazy custom frames",
        "frameazy frameazy customise frames",
        "frameazy frameazy custom",
        "frameazy frameazy frame",
        "frameazy frameazy frames",
        "frameazy frameazy",
        "frameazy frameazy frames",
        "frameazy frameazy custom frames",
        "frameazy frameazy customise frames",
        "frameazy frameazy custom",
        "frameazy frameazy frame",
        "frameazy frameazy frames",
        "frameazy frameazy",
        "frameazy frameazy frames",
        "frameazy frameazy custom frames",
        "frameazy frameazy customise frames",
        "frameazy frameazy custom",
        "frameazy frameazy frame",
        "frameazy frameazy frames",
        "frameazy frameazy",
        "frameazy frameazy frames",
        "frameazy frameazy custom frames",
        "frameazy frameazy customise frames",
        "frameazy frameazy custom",
        "frameazy frameazy frame",
        "frameazy frameazy frames",
        "frameazy frameazy",
        "frameazy frameazy frames",
        "frameazy frameazy custom frames",
        "frameazy frameazy customise frames",
        "frameazy frameazy custom",
        "frameazy frameazy frame",
        "frameazy frameazy frames",
        "frameazy frameazy",
        "frameazy frameazy frames",
        "frameazy frameazy custom frames",
        "frameazy frameazy customise frames",
        "frameazy frameazy custom",
        "frameazy frameazy frame",
        "frameazy frameazy frames",
        "frameazy frameazy",
        "frameazy frameazy frames",
        "frameazy frameazy custom frames",
        "frameazy frameazy customise frames",
        "frameazy frameazy custom",
        "frameazy frameazy frame",
        "frameazy frameazy frames",
        "frameazy frameazy",
        "frameazy frameazy frames",
        "frameazy frameazy custom frames",
        "frameazy frameazy customise frames",
    ],
    robots: "index, follow",
    // @ts-ignore
    lang: "en",
    twitter: {
        card: "summary",
        site: "@frameazy",
        creator: "@frameazy",
    },
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={poppins.className}>
                <ContextProviders>
                    <div className="_next">{children}</div>
                </ContextProviders>
            </body>
        </html>
    );
}
