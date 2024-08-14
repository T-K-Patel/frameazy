"use client";
import React, { useEffect, useState } from "react";
import Item from "../(components)/Item";

import { Button } from "@/components/ui/button";
import { RiArrowDropDownLine } from "react-icons/ri";
import { getFramesAction, FrameDataType, FramesFilterType } from "@/serverActions/frames/frame.action";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import useDebounce from "@/lib/useDebounce";
import FramesPagination from "./FramesPagination";
import FramesSideBar from "./FramesSideBar";

function Frames() {
    const [filters, setFilters] = useState<FramesFilterType>({
        categories: [],
        collections: [],
        aspects: [],
        colors: [],
    });
    const [totalFrames, setTotalFrames] = useState(0);
    const [page, setPage] = useState(1);
    const [sidebarHidden, setSidebarHidden] = useState(true);
    const [frames, setFrames] = useState<FrameDataType[]>();

    const debouncedFilters = useDebounce(filters, 800);
    useEffect(() => {
        getFramesAction(debouncedFilters, page - 1).then((data) => {
            if (data.success) {
                // setPage(1);
                setFrames(data.data.frames);
                setTotalFrames(data.data.frames.length);
            }
        });
    }, [debouncedFilters, page]);

    const [winWidth, setWinWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWinWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const totalPages = Math.ceil(totalFrames / 18);

    return (
        <section className="mx-auto w-11/12 max-w-screen-2xl gap-6">
            <div className="grid w-full gap-4 p-4 md:grid-cols-4">
                <aside className="col-span-1 hidden flex-col gap-y-10 py-5 md:flex">
                    <FramesSideBar filters={filters} setFilters={setFilters} />
                </aside>
                <div className="flex flex-col gap-y-2 md:col-span-3">
                    <div className="flex h-auto w-full justify-between">
                        <div>
                            {" "}
                            <h2 className="text-2xl font-semibold leading-9">Frames</h2>
                            <h4>
                                Showing {(page - 1) * 18 + 1} - {Math.min(page * 18, totalFrames)} of {totalFrames}{" "}
                                frames
                            </h4>
                        </div>
                        <div className="relative md:hidden">
                            <Dialog
                                open={!sidebarHidden && winWidth < 786}
                                onOpenChange={() => setSidebarHidden(!sidebarHidden)}
                            >
                                <DialogTrigger asChild={true}>
                                    <Button variant={"outline"} className="w-30 flex h-9 gap-2 p-2 md:hidden">
                                        <h1 className="text-xs font-semibold leading-4">Filters</h1>
                                        <RiArrowDropDownLine size={24} />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[90%] w-11/12 overflow-auto rounded-lg">
                                    <div className="flex h-fit w-auto flex-col items-center justify-start gap-y-5 overflow-y-auto md:gap-y-6">
                                        <FramesSideBar filters={filters} setFilters={setFilters} />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <div className="grid place-content-center items-center justify-center gap-y-5 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3">
                        {frames?.map((frame, ind) => {
                            return <Item item={frame} key={ind} />;
                        })}
                        {frames?.length == 0 && (
                            <>
                                <h1 className="text-center text-2xl font-semibold md:col-span-2 lg:col-span-3">
                                    No Frames Found
                                </h1>
                            </>
                        )}
                    </div>
                    <FramesPagination page={page} totalPages={totalPages} setPage={setPage} />
                </div>
            </div>
        </section>
    );
}

export default Frames;
