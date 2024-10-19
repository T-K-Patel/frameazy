import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BsCart3 } from "react-icons/bs";
import { Img } from "react-image";
import Logo from "@/assets/frameasy-logo.png"

function CNavBar() {
    return (
        <header>
            <nav className="mx-auto flex w-11/12 max-w-screen-2xl justify-between p-4">
                <Link href="/" replace className="text-dark-blue flex items-center gap-3">
                    <ArrowLeft size={30} />
                    <p className="text-xl font-semibold">Back</p>
                </Link>
                <Img src={Logo.src} alt="Frameazy" />
                <Link href="/cart" className="text-dark-blue flex items-center gap-3">
                    <BsCart3 size={30} />
                    <p className="text-xl font-semibold">Cart</p>
                </Link>
            </nav>
        </header>
    );
}

export default CNavBar;
