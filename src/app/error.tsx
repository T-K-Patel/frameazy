"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RxReload } from "react-icons/rx";

export default function Error() {
    const router = useRouter();
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-3">
            <h1 className="text-3xl font-bold">500 | Internal server occured</h1>
            <Button
                variant={"outline"}
                className="flex h-auto w-auto gap-3 border border-black p-4"
                onClick={() => router.refresh()}
            >
                <RxReload /> Reload
            </Button>
        </div>
    );
}
