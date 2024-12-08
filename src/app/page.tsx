import React, { Suspense } from "react";
import Hero from "./_components/Hero";
import PopularItems from "./_components/PopularItems";
import EnhanceArt from "./_components/EnhanceArt";
import PersonalizeFrame from "./_components/PersonalizeFrame";
import FAQ from "./_components/FAQs";

function Home() {
	return (
		<>
			<Hero />
			{/* <FrameArt /> */}
			<Suspense fallback={<div>Loading...</div>}>
				<PopularItems />
			</Suspense>
			<EnhanceArt />
			<PersonalizeFrame />
			<FAQ />
		</>
	);
}

export default Home;
