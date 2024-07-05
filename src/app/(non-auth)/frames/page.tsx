import React from "react";
import Item from "../(components)/Item";

function Frames() {
    return (
        <div className="h-auto w-[89%] gap-6 px-5">
            <div className="flex h-auto w-full justify-between">
                <div className="text-2xl font-semibold leading-9">Frames</div>
                {/* //TODO Dropdown menu */}
            </div>
            <div className="grid gap-y-5 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3">
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
        </div>
    );
}

export default Frames;
