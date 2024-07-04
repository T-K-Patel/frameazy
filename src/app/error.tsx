"use client"

import { Button } from "@/components/ui/button";
import { RxReload } from "react-icons/rx";

export default function Error() {
    return (
        <div className="h-screen flex flex-col gap-3 justify-center items-center">
            <h1 className="text-3xl font-bold">500 | Internal server occured</h1>
            <Button variant={"light"} className="h-auto w-auto p-4 border border-black" onClick={() => window.location.reload()}>
                <RxReload />
                Reload</Button>
        </div>
    );
}