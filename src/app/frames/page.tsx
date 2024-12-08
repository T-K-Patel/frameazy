"use client";
import React, { useEffect, useState, useTransition } from "react";
import useDebounce from "@/lib/useDebounce";
import AppPagination from "@/components/AppPagination";
import FramesSideBar from "./(components)/FramesSideBar";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { FRAMES_PER_PAGE } from "@/contants/frames";
import { FrameDataType } from "@/app/api/frames/gFrame/response";
import Item, { FrameLoading } from "../_components/Item";
import FilterDialog from "./(components)/FilterDialog";
import { Separator } from "@/components/ui/separator";

function Frames() {
	const [filters, setFilters] = useState({
		categories: [] as string[],
		collections: [] as string[],
		colors: [] as string[],
		name: "",
	});
	const [totalFrames, setTotalFrames] = useState(0);
	const [page, setPage] = useState(1);
	const [frames, setFrames] = useState<FrameDataType[]>();
	const [colors, setColors] = useState<string[]>([]);
	const [collections, setCollections] = useState<string[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);

	const [fetchingFrames, startFetchingFrames] = useTransition();
	const [fetchingFilters, startFetchingFilters] = useTransition();

	const debouncedFilters = useDebounce(filters, 500);
	const debouncedPage = useDebounce(page, 500);

	useEffect(() => {
		let fetching = true;
		const init = async () => {
			const queryParams = [
				`page=${debouncedPage - 1}`,
				debouncedFilters.name ? `name=${debouncedFilters.name}` : "",
				debouncedFilters.categories.map((cat) => `categories=${cat}`).join("&"),
				debouncedFilters.collections.map((col) => `collections=${col}`).join("&"),
				debouncedFilters.colors.map((col) => `colors=${col}`).join("&"),
			]
				.filter((q) => !!q)
				.join("&");

			try {
				const response = await fetch(`/api/frames/gFrame?${queryParams}`, {
					next: {
						revalidate: 3600,
					},
				});
				const data = await response.json();
				if (response.ok) {
					if (fetching) {
						setFrames(data.frames);
						setTotalFrames(data.total);
						setPage(data.page + 1);
						setError(null);
						window.scrollTo({ top: 0, behavior: "smooth" });
					}
				} else {
					toast.error(data?.error ?? "Failed to fetch frames");
					setFrames([]);
					setTotalFrames(0);
				}
			} catch (error) {
				console.log(error);
				toast.error("Failed to fetch frames");
				setError("Failed to fetch frames");
				setFrames([]);
			}
		};

		startFetchingFrames(init);
		return () => {
			fetching = false;
		};
	}, [debouncedFilters, debouncedPage]);

	useEffect(() => {
		let fetching = true;

		const init = async () => {
			try {
				const response = await fetch("/api/options/frameOptions", {
					next: {
						revalidate: 600,
						tags: ["frameOptions"],
					},
				});
				const data = await response.json();
				if (response.ok) {
					if (fetching) {
						setColors(data.colors);
						setCollections(data.collections);
						setCategories(data.categories);
					}
				} else {
					toast.error(data?.error ?? "Failed to fetch filters");
				}
			} catch (error) {
				console.log(error);
				toast.error("Failed to fetch filters");
			}
		};

		startFetchingFilters(init);

		return () => {
			fetching = false;
		};
	}, []);

	const totalPages = Math.ceil((totalFrames || 1) / FRAMES_PER_PAGE);

	return (
		<section className="mx-auto w-11/12 max-w-screen-2xl gap-6">
			{error ? (
				<p className="text-center text-2xl font-semibold text-red-500">{error ?? "No Frames"}</p>
			) : (
				<div className="flex w-full gap-4 md:grid-cols-4 md:p-4">
					<div className="col-span-1 hidden flex-col gap-y-10 border-r px-3 py-5 md:flex">
						<FramesSideBar
							filters={filters}
							availableFilters={{ colors, categories, collections }}
							handleFilterChange={(f) => setFilters((_f) => ({ ...f, name: _f.name }))}
							loading={fetchingFilters}
							// setFilters={setFilters}
							// colors={colors}
							// collections={collections}
							// categories={categories}
						/>
					</div>
					<Separator className="bg-black max-md:hidden" role="row" orientation="vertical" />
					<div className="flex w-full flex-col gap-y-5 md:col-span-3">
						<div className="flex flex-col rounded-lg border border-[#F1F1F1] p-3">
							<p className="border-b border-[#F1F1F1] pb-3 text-2xl font-semibold">Search Frames</p>
							<Input
								placeholder="Search Frames"
								className="h-10 w-full"
								value={filters.name}
								onChange={(e) => {
									setFilters((originalFilters) => {
										return {
											...originalFilters,
											name: e.target.value,
										};
									});
								}}
							/>
						</div>
						<div className="flex h-auto w-full justify-between rounded-lg border border-[#F1F1F1] p-3">
							<div>
								<p className="pb-3 text-2xl font-semibold">Frames</p>
								{totalFrames > 0 && (
									<h4>
										Showing {(page - 1) * FRAMES_PER_PAGE + 1} -{" "}
										{Math.min(page * FRAMES_PER_PAGE, totalFrames)} of {totalFrames} frames
									</h4>
								)}
							</div>
							<div className="relative md:hidden">
								<FilterDialog
									availableFilters={{ colors, categories, collections }}
									filters={filters}
									handleFilterChange={(f) => setFilters((_f) => ({ ...f, name: _f.name }))}
								/>
							</div>
						</div>
						<div
							className="grid place-content-center items-center justify-center gap-y-5 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3"
							style={{ gridTemplateRows: "subgrid" }}
						>
							{fetchingFrames ? (
								Array.from({ length: 6 }).map((_, ind) => {
									return <FrameLoading key={ind} />;
								})
							) : frames?.length == 0 ? (
								<>
									<h1 className="text-center text-2xl font-semibold md:col-span-2 lg:col-span-3">
										No Frames Found
									</h1>
								</>
							) : (
								frames?.map((frame, ind) => {
									return <Item item={frame} key={ind} />;
								})
							)}
						</div>
						{totalFrames > 0 && (
							<AppPagination
								page={page}
								totalPages={totalPages}
								setPage={fetchingFrames && fetchingFilters ? () => {} : setPage}
							/>
						)}
					</div>
				</div>
			)}
		</section>
	);
}

export default Frames;
