"use client";
import React, { useEffect, useState } from "react";
import Item, { FrameLoading } from "../(components)/Item";
import { Button } from "@/components/ui/button";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import useDebounce from "@/lib/useDebounce";
import AppPagination from "@/components/AppPagination";
import FramesSideBar from "./FramesSideBar";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { FRAMES_PER_PAGE } from "@/contants/frames";
import { FrameDataType } from "@/app/api/frames/gFrame/response";

function Frames() {
	const [filters, setFilters] = useState({
		categories: [] as string[],
		collections: [] as string[],
		colors: [] as string[],
		name: "",
	});
	const [totalFrames, setTotalFrames] = useState(0);
	const [page, setPage] = useState(1);
	const [sidebarHidden, setSidebarHidden] = useState(true);
	const [frames, setFrames] = useState<FrameDataType[]>();
	const [colors, setColors] = useState<string[]>([]);
	const [collections, setCollections] = useState<string[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const debouncedFilters = useDebounce(filters, 500);
	const debouncedPage = useDebounce(page, 500);

	useEffect(() => {
		let fetching = true;
		const init = async () => {
			setLoading(true);
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
			} finally {
				setLoading(false);
			}
		};

		init();
		return () => {
			fetching = false;
		};
	}, [debouncedFilters, debouncedPage]);

	const [winWidth, setWinWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			setWinWidth(window.innerWidth);
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

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

		init();

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
				<div className="grid w-full gap-4 md:grid-cols-4 md:p-4">
					<aside className="col-span-1 hidden flex-col gap-y-10 py-5 md:flex">
						<FramesSideBar
							filters={filters}
							setFilters={setFilters}
							colors={colors}
							collections={collections}
							categories={categories}
						/>
					</aside>
					<div className="flex flex-col gap-y-5 md:col-span-3">
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
								<Dialog
									open={!sidebarHidden && winWidth < 786}
									onOpenChange={() => setSidebarHidden(!sidebarHidden)}
								>
									<DialogTrigger asChild={true}>
										<Button variant={"outline"} className="w-30 flex h-9 gap-2 p-2 md:hidden">
											<h1 className="text-xs font-semibold leading-4">Filters</h1>
											<RiArrowDropDownLine size={24} />
										</Button>
									</DialogTrigger>
									<DialogContent className="max-w-11/12 max-h-[90%] overflow-auto rounded-lg">
										<div className="flex h-fit w-auto flex-col items-center justify-start gap-y-5 overflow-y-auto md:gap-y-6">
											<FramesSideBar
												filters={filters}
												setFilters={setFilters}
												colors={colors}
												collections={collections}
												categories={categories}
											/>
										</div>
									</DialogContent>
								</Dialog>
							</div>
						</div>
						<div
							className="grid place-content-center items-center justify-center gap-y-5 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3"
							style={{ gridTemplateRows: "subgrid" }}
						>
							{loading ? (
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
						{totalFrames > 0 && <AppPagination page={page} totalPages={totalPages} setPage={setPage} />}
					</div>
				</div>
			)}
		</section>
	);
}

export default Frames;
