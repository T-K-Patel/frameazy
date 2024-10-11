"use client"
import Checkbox from "@/components/Checkbox";
import { FramesFilterType, getUniqueCategory, getUniqueCollections, getUniqueColors } from "@/serverActions/frames/frame.action";
import { useEffect, useState } from "react";

interface SidebarProps {
    filters: FramesFilterType;
    setFilters: React.Dispatch<React.SetStateAction<FramesFilterType>>;
}

async function getFilters(){
    const colors = await getUniqueColors();
    const collections = await getUniqueCollections();
    const categories = await getUniqueCategory();
    return {colors,collections,categories};
}
function FramesSideBar({ filters, setFilters }: SidebarProps) {
    const [Colors,setColors] = useState<string[]>([]);
    const [Collections,setCollections] = useState<string[]>([]);
    const [Categories,setCategories] = useState<string[]>([]);
    useEffect(()=>{
        getFilters().then((filters)=>{
            setColors(filters.colors);
            setCollections(filters.collections);
            setCategories(filters.categories);
        });
    },[]);
    return (
        <div className="gap-8 max-md:flex max-md:flex-wrap max-md:p-4">
            <>
                <div className="flex h-min flex-col gap-y-1">
                    <h1 className="font-semibold leading-7">Frames Category</h1>
                    {Categories.map((category) => {
                        const isChecked = filters.categories.some((cat) => cat === category);
                        return (
                            <Checkbox
                                checked={isChecked}
                                key={category}
                                title={category}
                                onChange={(checked: boolean) => {
                                    if (checked) {
                                        setFilters((originalFilters) => {
                                            return {
                                                ...originalFilters,
                                                categories: [...originalFilters.categories, category],
                                            };
                                        });
                                    } else {
                                        setFilters((originalFilters) => {
                                            return {
                                                ...originalFilters,
                                                categories: originalFilters.categories.filter(
                                                    (cat) => cat !== category,
                                                ),
                                            };
                                        });
                                    }
                                }}
                            />
                        );
                    })}
                </div>
                <div className="flex flex-col gap-y-1">
                    <h1 className="font-semibold leading-7">Collections</h1>
                    {Collections.map((collection) => {
                        const isChecked = filters.collections.some((col) => col === collection);
                        return (
                            <Checkbox
                                checked={isChecked}
                                key={collection}
                                title={collection}
                                onChange={(checked: boolean) => {
                                    if (checked) {
                                        setFilters((originalFilters) => {
                                            return {
                                                ...originalFilters,
                                                collections: [...originalFilters.collections, collection],
                                            };
                                        });
                                    } else {
                                        setFilters((originalFilters) => {
                                            return {
                                                ...originalFilters,
                                                collections: originalFilters.collections.filter(
                                                    (cat) => cat !== collection,
                                                ),
                                            };
                                        });
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            </>
            <div className="flex w-full flex-col gap-y-1">
                <h1 className="font-semibold leading-7">Colors</h1>
                <div className="grid grid-cols-2 sm:grid-cols-4 sm:gap-2 md:grid-cols-2">
                    {Colors.map((color) => {
                        const isChecked = filters.colors.some((col) => col === color);
                        return (
                            <Checkbox
                                checked={isChecked}
                                key={color}
                                title={color}
                                onChange={(checked: boolean) => {
                                    if (checked) {
                                        setFilters((originalFilters) => {
                                            return {
                                                ...originalFilters,
                                                colors: [...originalFilters.colors, color],
                                            };
                                        });
                                    } else {
                                        setFilters((originalFilters) => {
                                            return {
                                                ...originalFilters,
                                                colors: originalFilters.colors.filter((cat) => cat !== color),
                                            };
                                        });
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default FramesSideBar;
