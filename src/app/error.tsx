"use client";

import { Button } from "@/components/ui/button";
import { RxReload } from "react-icons/rx";

export default function Error() {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-3">
            <h1 className="text-3xl font-bold">500 | Internal server occured</h1>
            <Button
                variant={"light"}
                className="h-auto w-auto border border-black p-4"
                onClick={() => window.location.reload()}
            >
                <RxReload />
                Reload
            </Button>
        </div>
    );
}
