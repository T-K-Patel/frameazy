import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
    title: "Frameazy | You dream, we deliver",
    description: "Customise your own frames with Frameazy. We deliver your dream frames to your doorstep.",
    keywords: ["frameazy", "frames", "custom frames", "customise frames", "customise", "custom", "frame", "frames", "frameazy frames", "frameazy custom frames", "frameazy customise frames", "frameazy custom", "frameazy frame", "frameazy frames", "frameazy frameazy", "frameazy frameazy frames", "frameazy frameazy custom frames", "frameazy frameazy customise frames", "frameazy frameazy custom", "frameazy frameazy frame", "frameazy frameazy frames", "frameazy frameazy", "frameazy frameazy frames", "frameazy frameazy custom frames", "frameazy frameazy customise frames", "frameazy frameazy custom", "frameazy frameazy frame", "frameazy frameazy frames", "frameazy frameazy", "frameazy frameazy frames", "frameazy frameazy custom frames", "frameazy frameazy customise frames", "frameazy frameazy custom", "frameazy frameazy frame", "frameazy frameazy frames", "frameazy frameazy", "frameazy frameazy frames", "frameazy frameazy custom frames", "frameazy frameazy customise frames", "frameazy frameazy custom", "frameazy frameazy frame", "frameazy frameazy frames", "frameazy frameazy", "frameazy frameazy frames", "frameazy frameazy custom frames", "frameazy frameazy customise frames", "frameazy frameazy custom", "frameazy frameazy frame", "frameazy frameazy frames", "frameazy frameazy", "frameazy frameazy frames", "frameazy frameazy custom frames", "frameazy frameazy customise frames", "frameazy frameazy custom", "frameazy frameazy frame", "frameazy frameazy frames", "frameazy frameazy", "frameazy frameazy frames", "frameazy frameazy custom frames", "frameazy frameazy customise frames", "frameazy frameazy custom", "frameazy frameazy frame", "frameazy frameazy frames", "frameazy frameazy", "frameazy frameazy frames", "frameazy frameazy custom frames", "frameazy frameazy customise frames", "frameazy frameazy custom", "frameazy frameazy frame", "frameazy frameazy frames", "frameazy frameazy", "frameazy frameazy frames", "frameazy frameazy custom frames", "frameazy frameazy customise frames"],
    robots: "index, follow",
    // @ts-ignore
    lang: "en",
    twitter: {
        card: "summary",
        site: "@frameazy",
        creator: "@frameazy",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    )
}