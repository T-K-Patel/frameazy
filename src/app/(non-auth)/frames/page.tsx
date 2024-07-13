"use client"
import React, { useEffect, useState } from "react";
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
import { Category, Collection, Color } from "@prisma/client";
import Checkbox from "@/components/Checkbox";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FramesDataType, FramesFilterType, getFramesAction } from "@/serverActions/frames/frame.action";

const PopularSizes=["4x6","12x18","5x7","13x19","8x10","16x20","8x12","18x24","10x13","20x20","11x14","20x24","11x17","24x36","12x12","26x22"]

function Frames() {
    const [filters,setFilters]=useState<FramesFilterType>({categories:[],collections:[],aspects:[],colors:[]})
    const [sidebarHidden,setSidebarHidden]=useState(true);
    const [frames,setFrames]=useState<FramesDataType[]>()
    useEffect(()=>{
        getFramesAction(filters).then((result)=>{
            if(result.success)setFrames(result.data)
            else{throw new Error(result.error)}
        })
    },[filters])
    return (
        <section className="mx-auto w-11/12 max-w-screen-2xl gap-6">
            <div className="grid w-full grid-cols-4 gap-4 p-4">
                <aside className="col-span-1 flex-col gap-y-10 py-5 hidden md:flex">
                    <ul className="flex flex-col gap-y-1">
                        <h1 className="font-semibold leading-7">Frames Category</h1>
                        {Object.values(Category).map((category) => (
                            <Checkbox key={category} title={category} onChange={(checked:boolean)=>{
                                if(checked){
                                    setFilters((originalFilters) => {
                                        return {
                                            ...originalFilters,
                                            categories: [...originalFilters.categories, category]
                                        };
                                    });
                                }
                                else{
                                    setFilters((originalFilters) => {
                                        return {
                                            ...originalFilters,
                                            categories: originalFilters.categories.filter((cat) => cat !== category)
                                        };
                                    });
                                }}}/>
                            ))}
                    </ul>
                    <ul className="flex flex-col gap-y-1">
                        <h1 className="font-semibold leading-7">Collections</h1>
                        {Object.values(Collection).map((collection) => (
                            <Checkbox key={collection} title={collection} onChange={(checked:boolean)=>{
                                if(checked){
                                    setFilters((originalFilters) => {
                                        return {
                                            ...originalFilters,
                                            collections: [...originalFilters.collections, collection]
                                        };
                                    });
                                }
                                else{
                                    setFilters((originalFilters) => {
                                        return {
                                            ...originalFilters,
                                            collections: originalFilters.collections.filter((cat) => cat !== collection)
                                        };
                                    });
                                }}}/>
                            ))}
                    </ul>
                    <section className="flex flex-col gap-y-3">
                        <span className="font-semibold">Custom sizes</span>
                        <ul className="flex flex-col gap-y-5">
                            <li className="flex items-center gap-x-7">
                                <p className="text-[0.9rem] font-medium">Width:</p>
                                <div className="flex items-center gap-x-3">
                                    <Input
                                        name="width"
                                        className="h-8 w-14 overflow-hidden rounded-lg bg-[#F5F4F4] text-center"
                                        placeholder="0"
                                    />
                                    <span className="font-semibold text-[0.9rem]">In</span>
                                </div>
                            </li>
                            <li className="flex items-center gap-x-6">
                                <p className="text-[0.9rem] font-medium">Height:</p>
                                <div className="flex items-center gap-x-3">
                                    <Input
                                        name="height"
                                        className="h-8 w-14 overflow-hidden rounded-lg bg-[#F5F4F4] text-center"
                                        placeholder="0"
                                    />
                                    <span className="text-[0.9rem] font-semibold">In</span>
                                </div>
                            </li>
                        </ul>
                    </section>
                    <ul className="flex flex-col gap-y-1">
                        <h1 className="font-semibold leading-7">Popular Sizes</h1>
                        <div className="grid grid-cols-2 gap-2">
                            {PopularSizes.map((size) => (
                                <Checkbox key={size} title={size} onChange={(checked:boolean)=>{
                                    const [height,width]=size.split("x").map((val)=>parseInt(val))
                                    if(checked){
                                        setFilters((originalFilters) => {
                                            return {
                                                ...originalFilters,
                                                aspects: [...originalFilters.aspects, {height:height,width:width}]
                                            };
                                        });
                                    }
                                    else{
                                        setFilters((originalFilters) => {
                                            return {
                                                ...originalFilters,
                                                aspects: originalFilters.aspects.filter((cat) => cat.height !== height && cat.width!==width)
                                            };
                                        });
                                    }}}/>
                                ))}
                        </div>
                    </ul>
                    <ul className="flex flex-col gap-y-1">
                        <h1 className="font-semibold leading-7">Colors</h1>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.values(Color).map((color) => (
                                <Checkbox key={color} title={color} onChange={(checked:boolean)=>{
                                    if(checked){
                                        setFilters((originalFilters) => {
                                            return {
                                                ...originalFilters,
                                                colors: [...originalFilters.colors, color]
                                            };
                                        });
                                    }
                                    else{
                                        setFilters((originalFilters) => {
                                            return {
                                                ...originalFilters,
                                                colors: originalFilters.colors.filter((cat) => cat !== color)
                                            };
                                        });
                                    }}}/>
                                ))}
                        </div>
                    </ul>
                </aside>
                <div className="col-span-3 flex flex-col gap-y-2">
                    <div className="flex h-auto w-full justify-between">
                        <div className="text-2xl font-semibold leading-9">Frames</div>
                        <div>
                        <Button variant={"outline"} onClick={()=>setSidebarHidden(!sidebarHidden)} className="h-9 w-30 flex gap-2 p-2 md:hidden">
                            <h1 className="font-semibold text-xs leading-4">Categories</h1>
                            <RiArrowDropDownLine size={24}/>
                        </Button>
                        {!sidebarHidden && 
                            <aside className={`absolute col-span-1 flex flex-col gap-y-4 py-5 z-30 w-48 px-5 bg-white text-left shadow-xl duration-300 ease-in-out md:hidden`}>
                                <ul className="flex flex-col gap-y-1">
                                    <h1 className="font-semibold leading-7">Frames Category</h1>
                                    {Object.values(Category).map((category) => (
                                        <Checkbox key={category} title={category} onChange={(checked:boolean)=>{
                                            if(checked){
                                                setFilters((originalFilters) => {
                                                    return {
                                                        ...originalFilters,
                                                        categories: [...originalFilters.categories, category]
                                                    };
                                                });
                                            }
                                            else{
                                                setFilters((originalFilters) => {
                                                    return {
                                                        ...originalFilters,
                                                        categories: originalFilters.categories.filter((cat) => cat !== category)
                                                    };
                                                });
                                            }}}/>
                                        ))}
                                </ul>
                                <ul className="flex flex-col gap-y-1">
                                    <h1 className="font-semibold leading-7">Collections</h1>
                                    {Object.values(Collection).map((collection) => (
                                        <Checkbox key={collection} title={collection} onChange={(checked:boolean)=>{
                                            if(checked){
                                                setFilters((originalFilters) => {
                                                    return {
                                                        ...originalFilters,
                                                        collections: [...originalFilters.collections, collection]
                                                    };
                                                });
                                            }
                                            else{
                                                setFilters((originalFilters) => {
                                                    return {
                                                        ...originalFilters,
                                                        collections: originalFilters.collections.filter((cat) => cat !== collection)
                                                    };
                                                });
                                            }}}/>
                                        ))}
                                </ul>
                                <section className="flex flex-col gap-y-3">
                                    <span className="font-semibold">Custom sizes</span>
                                    <ul className="flex flex-col gap-y-5">
                                        <li className="flex items-center gap-x-7">
                                            <p className="text-[0.9rem] font-medium">Width:</p>
                                            <div className="flex items-center gap-x-3">
                                                <Input
                                                    name="width"
                                                    className="h-8 w-14 overflow-hidden rounded-lg bg-[#F5F4F4] text-center"
                                                    placeholder="0"
                                                />
                                                <span className="font-semibold text-[0.9rem]">In</span>
                                            </div>
                                        </li>
                                        <li className="flex items-center gap-x-6">
                                            <p className="text-[0.9rem] font-medium">Height:</p>
                                            <div className="flex items-center gap-x-3">
                                                <Input
                                                    name="height"
                                                    className="h-8 w-14 overflow-hidden rounded-lg bg-[#F5F4F4] text-center"
                                                    placeholder="0"
                                                />
                                                <span className="text-[0.9rem] font-semibold">In</span>
                                            </div>
                                        </li>
                                    </ul>
                                </section>
                                <ul className="flex flex-col gap-y-1">
                                    <h1 className="font-semibold leading-7">Popular Sizes</h1>
                                    <div className="grid grid-cols-2 gap-2">
                                        {PopularSizes.map((size) => (
                                            <Checkbox key={size} title={size} onChange={(checked:boolean)=>{
                                                const [height,width]=size.split("x").map((val)=>parseInt(val))
                                                if(checked){
                                                    setFilters((originalFilters) => {
                                                        return {
                                                            ...originalFilters,
                                                            aspects: [...originalFilters.aspects, {height:height,width:width}]
                                                        };
                                                    });
                                                }
                                                else{
                                                    setFilters((originalFilters) => {
                                                        return {
                                                            ...originalFilters,
                                                            aspects: originalFilters.aspects.filter((cat) => cat.height !== height && cat.width!==width)
                                                        };
                                                    });
                                                }}}/>
                                            ))}
                                    </div>
                                </ul>
                                <ul className="flex flex-col gap-y-1">
                                    <h1 className="font-semibold leading-7">Colors</h1>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.values(Color).map((color) => (
                                            <Checkbox key={color} title={color} onChange={(checked:boolean)=>{
                                                if(checked){
                                                    setFilters((originalFilters) => {
                                                        return {
                                                            ...originalFilters,
                                                            colors: [...originalFilters.colors, color]
                                                        };
                                                    });
                                                }
                                                else{
                                                    setFilters((originalFilters) => {
                                                        return {
                                                            ...originalFilters,
                                                            colors: originalFilters.colors.filter((cat) => cat !== color)
                                                        };
                                                    });
                                                }}}/>
                                        ))}
                                    </div>
                                </ul>
                            </aside>}
                        </div>
                    </div>
                    <div className="grid place-content-center items-center justify-center gap-y-5 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3">
                        {frames?.map((frame)=>{
                            return (
                                <Item item={frame}/> 
                            )
                        })}
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
