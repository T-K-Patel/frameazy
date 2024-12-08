import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function NotFound() {
	return (
		<>
			<div className="flex w-full flex-col items-center justify-center gap-3 p-5">
				<h1 className="text-2xl">Bhai kya kar raha hai.</h1>
				<h1 className="text-xl">Yaha kuch nahi rakha, wapas chala jaa</h1>
				<Link href={"/"}>
					<Button size={"lg"} className="h-auto py-4 transition-all duration-200 active:scale-90">
						Mujhe ghar jana hai
					</Button>
				</Link>
			</div>
		</>
	);
}

export default NotFound;
