/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import React from "react";

function CancelOrderDialog({ cancelOrder, cancelingOrder }: { cancelOrder: () => void; cancelingOrder: boolean }) {
	const [open, setOpen] = React.useState(false);
	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button disabled={cancelingOrder} className="bg-red-500">
					{cancelingOrder ? "Canceling" : "Cancel Order"}
				</Button>
			</DialogTrigger>
			<DialogContent className="flex w-fit flex-col gap-4 pt-3">
				<DialogHeader>
					<h1 className="me-4 text-xl font-bold">Confirm To Cancel</h1>
				</DialogHeader>
				<div className="grid grid-cols-2 gap-3">
					<Button
						size={"lg"}
						className="h-auto w-full py-4"
						onClick={() => {
							setOpen(false);
						}}
					>
						Return
					</Button>
					<Button
						size={"lg"}
						variant={"destructive"}
						className="h-auto w-full py-4"
						onClick={() => {
							setOpen(false);
							cancelOrder();
						}}
					>
						Confirm Cancel
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default CancelOrderDialog;
