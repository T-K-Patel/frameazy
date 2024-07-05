import React from "react";
import Item from "../(components)/Item";

function Frames() {
    return <div className="w-[89%] h-auto gap-6 px-5">
        <div className="w-full h-auto flex justify-between">
            <div className="font-semibold text-2xl leading-9">Frames</div>
            //TODO Dropdown menu
        </div>
        <div className="grid gap-y-5 md:grid-cols-2 lg:grid-cols-3 md:gap-x-6">
            <Item/>
            <Item/>
            <Item/>
            <Item/>
            <Item/>
            <Item/>
            <Item/>
            <Item/>
            <Item/>
        </div>
    </div>;
}

export default Frames;
