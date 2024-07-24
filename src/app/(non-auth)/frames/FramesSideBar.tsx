import Checkbox from "@/components/Checkbox";
import { Input } from "@/components/ui/input";
import { FramesFilterType } from "@/serverActions/frames/frame.action";
import { Category, Collection, Color } from "@prisma/client";

const PopularSizes = [
    "4x6",
    "12x18",
    "5x7",
    "13x19",
    "8x10",
    "16x20",
    "8x12",
    "18x24",
    "10x13",
    "20x20",
    "11x14",
    "20x24",
    "11x17",
    "24x36",
    "12x12",
    "26x22",
];

interface SidebarProps {
    filters: FramesFilterType;
    setFilters: React.Dispatch<React.SetStateAction<FramesFilterType>>;
}

function FramesSideBar({ filters, setFilters }: SidebarProps) {
    return (
        <div className="gap-8 max-md:flex max-md:flex-wrap max-md:p-4">
            <>
                <div className="flex h-min flex-col gap-y-1">
                    <h1 className="font-semibold leading-7">Frames Category</h1>
                    {Object.values(Category).map((category) => {
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
                    {Object.values(Collection).map((collection) => {
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
                <div className="flex flex-col gap-y-3">
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
                                <span className="text-[0.9rem] font-semibold">In</span>
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
                </div>
            </>
            <div className="flex flex-col gap-y-1">
                <h1 className="font-semibold leading-7">Popular Sizes</h1>
                <div className="grid grid-cols-3 gap-2 md:grid-cols-2">
                    {PopularSizes.map((size) => {
                        const [height, width] = size.split("x").map((val) => parseInt(val, 10));
                        const isChecked = filters.aspects.some(
                            (aspect) => aspect.height === height && aspect.width === width,
                        );
                        return (
                            <Checkbox
                                checked={isChecked}
                                key={size}
                                title={size}
                                onChange={(checked: boolean) => {
                                    if (checked) {
                                        setFilters((originalFilters) => {
                                            return {
                                                ...originalFilters,
                                                aspects: [...originalFilters.aspects, { height: height, width: width }],
                                            };
                                        });
                                    } else {
                                        setFilters((originalFilters) => {
                                            return {
                                                ...originalFilters,
                                                aspects: originalFilters.aspects.filter(
                                                    (cat) => cat.height !== height && cat.width !== width,
                                                ),
                                            };
                                        });
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="flex flex-col gap-y-1">
                <h1 className="font-semibold leading-7">Colors</h1>
                <div className="grid grid-cols-3 gap-2 md:grid-cols-2">
                    {Object.values(Color).map((color) => {
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
