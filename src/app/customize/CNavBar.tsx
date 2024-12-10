"use client";
import Logo from "@/assets/frameasy-logo.png";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BsCart3 } from "react-icons/bs";

function CNavBar() {
	return (
		<header>
			<nav className="mx-auto flex w-11/12 max-w-screen-2xl justify-between p-4">
				<Link href="/" replace className="text-dark-blue flex items-center gap-3">
					<ArrowLeft size={24} className="text-xs" />
					<p className="text-sm font-semibold md:text-xl">Back</p>
				</Link>
				<Image
					src={Logo.src}
					width={Logo.width}
					blurDataURL={Logo.blurDataURL}
					placeholder="blur"
					alt="Frameazy"
					height={Logo.height}
					className="w-24 md:w-36"
				/>
				<Link href="/cart" className="text-dark-blue flex items-center gap-3">
					<BsCart3 size={26} />
					<p className="text-sm font-semibold md:text-xl">Cart</p>
				</Link>
			</nav>
		</header>
	);
}

export default CNavBar;
