"use client";
import FAQ from "./(components)/FAQs";
import Hero from "./(components)/Hero";
import FrameArt from "./(components)/FrameArt";
import EnhanceArt from "./(components)/EnhanceArt";
import PersonalizeFrame from "./(components)/PersonalizeFrame";
import PopularItems from "./(components)/PopularItems";
import { Suspense } from "react";

export default function Home() {
    return (
        <>
            <Hero />
            <FrameArt />
            <Suspense fallback={<div>Loading...</div>} >
                <PopularItems />
            </Suspense>
            <EnhanceArt />
            <PersonalizeFrame />
            <FAQ />
        </>
    );
}
