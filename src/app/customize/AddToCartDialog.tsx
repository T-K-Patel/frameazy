/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React from "react";
import { Label } from "@radix-ui/react-label";

function AddToCartDialog({ addToCart, addingToCart }: { addToCart: (qty: number) => void; addingToCart: boolean }) {
    const [quantity, setQuantity] = React.useState(1);
    const [open, setOpen] = React.useState(false);
    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                <Button size={"lg"} disabled={addingToCart} className="h-auto w-full py-4">
                    {addingToCart ? "Adding..." : "Add to Cart"}
                </Button>
            </DialogTrigger>
            <DialogContent className="flex w-fit flex-col gap-4 pt-3">
                <DialogHeader>
                    <h1 className="me-4 text-xl font-bold">Enter quantity to proceed</h1>
                </DialogHeader>
                <div className="grid gap-2">
                    <Label className="font-semibold">Quantity</Label>
                    <Input
                        type="number"
                        name="quantity"
                        step={1}
                        min={1}
                        max={100}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        placeholder="1"
                        className="w-full p-3"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        size={"lg"}
                        variant={"destructive"}
                        className="h-auto w-full py-4"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        size={"lg"}
                        className="h-auto w-full py-4"
                        onClick={() => {
                            setOpen(false);
                            addToCart(quantity);
                        }}
                    >
                        Add to Cart
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AddToCartDialog;
