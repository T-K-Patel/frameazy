import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Filters = {
	colors: string[];
	categories: string[];
	collections: string[];
};

type SidebarFilterProps = {
	filters: Filters; // Currently selected filters
	availableFilters: Filters; // All available filter options
	handleFilterChange: (updatedFilters: Filters) => void; // Function to update filters
	loading: boolean;
};

const SidebarFilter: React.FC<SidebarFilterProps> = ({ filters, availableFilters, handleFilterChange, loading }) => {
	const handleCheckboxChange = (group: keyof Filters, value: string) => {
		handleFilterChange({
			...filters,
			[group]: filters[group].includes(value)
				? filters[group].filter((item) => item !== value) // Remove if already selected
				: [...filters[group], value], // Add if not selected
		});
	};

	const resetFilters = () => {
		handleFilterChange({ colors: [], categories: [], collections: [] });
	};

	const areFilterSet = filters.colors.length || filters.categories.length || filters.collections.length;

	return (
		<aside className="w-64 space-y-3">
			<h2 className="text-xl font-semibold">Filters</h2>
			{areFilterSet ? (
				<div className="mt-3 space-y-2">
					<Button variant="secondary" onClick={resetFilters} disabled={loading} className="w-full">
						Reset Filters
					</Button>
				</div>
			) : (
				<></>
			)}
			<div className="space-y-3">
				{Object.entries(availableFilters).map(([group, options]) => (
					<div key={group}>
						<h3 className="text-lg font-semibold capitalize">{group}</h3>
						<div className="space-y-2">
							{loading
								? Array.from({ length: 4 }).map((_, ind) => {
										return (
											<label key={ind} className="flex items-center space-x-2">
												<Skeleton className="h-5 w-52" />
											</label>
										);
									})
								: options.map((option) => (
										<label key={option} className="flex items-center space-x-2">
											<Checkbox
												checked={filters[group as keyof Filters].includes(option)}
												onCheckedChange={() =>
													handleCheckboxChange(group as keyof Filters, option)
												}
											/>
											<span>{option}</span>
										</label>
									))}
						</div>
					</div>
				))}
			</div>
		</aside>
	);
};

export default SidebarFilter;
