"use client";
import FAQ from "./(components)/FAQs";
import Hero from "./(components)/Hero";
import EnhanceArt from "./(components)/EnhanceArt";
import PersonalizeFrame from "./(components)/PersonalizeFrame";
import PopularItems from "./(components)/PopularItems";

export default function Home() {
	return (
		<>
			<Hero />
			{/* <FrameArt /> */}
			<PopularItems />
			<EnhanceArt />
			<PersonalizeFrame />
			<FAQ />
		</>
	);
}
