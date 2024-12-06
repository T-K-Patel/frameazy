import React from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

type AppPaginationPropType = {
	page: number;
	totalPages: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
};

function AppPagination({ page, totalPages, setPage }: AppPaginationPropType) {
	return (
		<Pagination>
			<PaginationContent>
				{
					<PaginationItem>
						<Button
							size={"icon"}
							className="w-auto px-3"
							onClick={() => {
								setPage((p) => p - 1);
							}}
							variant={"default"}
							disabled={page == 1}
						>
							&lt; Previous
						</Button>
					</PaginationItem>
				}

				<PaginationItem>
					<Button
						size={"icon"}
						variant={page == 1 ? "default" : "outline"}
						onClick={() => {
							setPage(1);
						}}
					>
						1
					</Button>
				</PaginationItem>

				{page > 3 && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{page > 2 && (
					<PaginationItem>
						<Button
							size={"icon"}
							variant={"outline"}
							onClick={() => {
								setPage(page - 1);
							}}
						>
							{page - 1}
						</Button>
					</PaginationItem>
				)}

				{page > 1 && page < totalPages && (
					<PaginationItem>
						<Button size={"icon"} variant={"default"}>
							{page}
						</Button>
					</PaginationItem>
				)}

				{page < totalPages - 1 && (
					<PaginationItem>
						<Button
							size={"icon"}
							variant={"outline"}
							onClick={() => {
								setPage(page + 1);
							}}
						>
							{page + 1}
						</Button>
					</PaginationItem>
				)}

				{page < totalPages - 2 && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{totalPages != 1 && (
					<PaginationItem>
						<Button
							size={"icon"}
							variant={page == totalPages ? "default" : "outline"}
							onClick={() => {
								setPage(totalPages);
							}}
						>
							{totalPages}
						</Button>
					</PaginationItem>
				)}

				<PaginationItem>
					<Button
						size={"icon"}
						className="w-auto px-3"
						onClick={() => {
							setPage((p) => p + 1);
						}}
						variant={"default"}
						disabled={page == totalPages}
					>
						Next &gt;
					</Button>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

export default AppPagination;
