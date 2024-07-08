import React from "react";
import Item from "../(components)/Item";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

function Frames() {
    return (
        <section className="mx-auto w-11/12 max-w-screen-2xl gap-6">
            <div className="grid w-full grid-cols-4 gap-4 bg-black bg-opacity-20 p-4">
                <div className="col-span-1"></div>
                <div className="col-span-3">
                    <div className="flex h-auto w-full justify-between">
                        <div className="text-2xl font-semibold leading-9">Frames</div>
                    </div>
                    <div className="grid place-content-center items-center justify-center gap-y-5 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3">
                        <Item />
                        <Item />
                        <Item />
                        <Item />
                        <Item />
                        <Item />
                        <Item />
                        <Item />
                        <Item />
                    </div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="1">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </section>
    );
}

export default Frames;
