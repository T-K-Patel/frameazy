import React, { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

type Filters = {
	colors: string[];
	categories: string[];
	collections: string[];
};

type FilterPopupProps = {
	filters: Filters; // Currently selected filters
	availableFilters: Filters; // All available filter options
	handleFilterChange: (updatedFilters: Filters) => void; // Function to update filters
};

const FilterDialog: React.FC<FilterPopupProps> = ({ filters, availableFilters, handleFilterChange }) => {
	const [localFilters, setLocalFilters] = useState<Filters>(filters);
	const [open, setOpen] = useState(false);

	const handleCheckboxChange = (group: keyof Filters, value: string) => {
		setLocalFilters((prevFilters) => ({
			...prevFilters,
			[group]: prevFilters[group].includes(value)
				? prevFilters[group].filter((item) => item !== value) // Remove if already selected
				: [...prevFilters[group], value], // Add if not selected
		}));
	};

	useEffect(() => {
		setLocalFilters(filters);
	}, [filters]);

	const applyFilters = () => {
		handleFilterChange(localFilters);
		setOpen(false);
	};

	const resetFilters = () => {
		setLocalFilters({ colors: [], categories: [], collections: [] });
		handleFilterChange({ colors: [], categories: [], collections: [] });
		setOpen(false);
	};

	const areFilterSet = filters.colors.length || filters.categories.length || filters.collections.length;

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button variant="outline">
					Filters {areFilterSet ? `(${areFilterSet})` : ""}
					<ChevronDown className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="w-full max-w-md p-4 sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>Filters</DialogTitle>
				</DialogHeader>
				<div className="max-h-[60vh] space-y-4 overflow-y-auto">
					{Object.entries(availableFilters).map(([group, options]) => (
						<div key={group}>
							<h3 className="text-lg font-semibold capitalize">{group}</h3>
							<div className="space-y-2">
								{options.map((option) => (
									<label key={option} className="flex items-center space-x-2">
										<Checkbox
											checked={localFilters[group as keyof Filters].includes(option)}
											onCheckedChange={() => handleCheckboxChange(group as keyof Filters, option)}
										/>
										<span>{option}</span>
									</label>
								))}
							</div>
						</div>
					))}
				</div>
				<DialogFooter className="flex justify-between">
					<Button variant="secondary" onClick={resetFilters}>
						Reset
					</Button>
					<Button onClick={applyFilters}>Apply Filters</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default FilterDialog;
