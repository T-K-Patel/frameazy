"use client";
import AddArtwork from "@/components/AddArtwork";
import Navbar from "@/components/Navbar";
import FAQ from "@/components/FAQs";
import Hero from "./(components)/Hero";
import FrameArt from "@/app/(components)/FrameArt";
import EnhanceArt from "@/app/(components)/EnhanceArt";
import PersonalizeFrame from "@/app/(components)/PersonalizeFrame";
import PopularItems from "@/app/(components)/PopularItems";

export default function Home() {
    return (
        <>
            <Hero />
            <FrameArt />
            <PopularItems />
            <EnhanceArt />
            <PersonalizeFrame />
            <FAQ />
        </>
    );
}
