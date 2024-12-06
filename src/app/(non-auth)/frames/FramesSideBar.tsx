"use client";
import Checkbox from "@/components/Checkbox";
import { FramesFilterType } from "@/serverActions/frames/frame.action";

interface SidebarProps {
	filters: FramesFilterType;
	setFilters: React.Dispatch<React.SetStateAction<FramesFilterType>>;
	colors: string[];
	collections: string[];
	categories: string[];
}

function FramesSideBar({ filters, setFilters, colors, collections, categories }: SidebarProps) {
	return (
		<div className="gap-8 max-md:flex max-md:flex-wrap max-md:p-4">
			<>
				<div className="flex h-min flex-col gap-y-1">
					<h1 className="font-semibold leading-7">Frames Category</h1>
					{categories.map((category) => {
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
					{collections.map((collection) => {
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
					{colors.map((color) => {
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
