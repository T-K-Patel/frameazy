"use client";
import React, { useState, useEffect, use } from "react";
import DropDown from "@/components/DropDown";
import { OrderStatus, CartCustomization } from "@prisma/client";
import {
	getOrderDetailsAction,
	updateOrderStatusAction,
	AdminOrderDetailsType,
	updateDeliveryDateAction,
} from "@/serverActions/admin/admin.action";
import { Button } from "@/components/ui/button";

import { LoadingSkeleton } from "./LoadingSkeleton";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { IoMdOpen } from "react-icons/io";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { checkPaymentStatus } from "@/serverActions/payments/payments.action";
import { Img } from "react-image";

const capitalizeFirstLetter = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

const UpdateButton = ({ disabled }: { disabled: boolean }) => {
	const { pending } = useFormStatus();
	return <Button disabled={disabled || pending}>{pending ? "Updating" : "Update"}</Button>;
};

const OrderDetails = ({ params: _params }: { params: Promise<{ id: string }> }) => {
	const [order, setOrder] = useState<AdminOrderDetailsType | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const params = use(_params);

	const [status, setStatus] = useState<OrderStatus>(OrderStatus.Received);
	const [deliveryDate, setDeliveryDate] = useState<Date | null>(new Date());

	const [updateStatusError, setUpdateStatusError] = useState<string | null>(null);
	const [deliveryStatusError, setDeliveryStatusError] = useState<string | null>(null);

	const [statusUpdateState, statusUpdateAction] = useFormState(updateOrderStatusAction, null);
	const [deliveryUpdateState, deliveryUpdateAction] = useFormState(updateDeliveryDateAction, null);

	useEffect(() => {
		if (!statusUpdateState) return;
		if (statusUpdateState?.success) {
			setOrder((o: AdminOrderDetailsType | null) => (o ? { ...o, order_status: statusUpdateState.data } : null));
			setUpdateStatusError(null);
			return;
		}
		if (statusUpdateState?.success == false) {
			setUpdateStatusError(statusUpdateState.error);
			return;
		}
		setUpdateStatusError("Something went wrong");
	}, [statusUpdateState]);

	useEffect(() => {
		if (!deliveryUpdateState) return;
		if (deliveryUpdateState?.success) {
			setOrder((o: AdminOrderDetailsType | null) =>
				o ? { ...o, delivery_date: deliveryUpdateState.data } : null,
			);
			setDeliveryStatusError(null);
			return;
		}
		if (deliveryUpdateState?.success == false) {
			setDeliveryStatusError(deliveryUpdateState.error);
			return;
		}
		setDeliveryStatusError("Something went wrong");
	}, [deliveryUpdateState]);

	useEffect(() => {
		getOrderDetailsAction(params.id)
			.then((data) => {
				if (data.success) {
					setOrder(data.data);
					setStatus(data.data.order_status);
					setDeliveryDate(data.data.delivery_date);
					setError(null);

					if (
						data.data?.transaction?.status === "Created" ||
						data.data?.transaction?.status === "Attempted"
					) {
						checkPaymentStatus(data.data.id)
							.then((data) => {
								if (data.success) {
									if (data.data) {
										setOrder((prev) =>
											prev
												? {
														...prev,
														order_status: "Processing",
														transaction: { ...prev.transaction, status: "Paid" },
													}
												: prev,
										);
									}
								} else {
									setError(data.error);
								}
							})
							.catch((error) => {
								console.log(error);
								setError("Something went wrong");
							});
					}
				} else {
					setError(data.error);
					setOrder(null);
				}
			})
			.catch((error) => {
				console.log(error);
				setError("Something went wrong");
				setOrder(null);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [params.id]);

	return (
		<div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-8 py-5">
			{loading ? (
				<LoadingSkeleton />
			) : error ? (
				<p className="text-center text-2xl font-semibold text-red-500">{error ?? "No new orders"}</p>
			) : (
				order && (
					<>
						<section className="flex flex-col rounded-lg border border-[#F1F1F1] p-3">
							<p className="p border-b border-[#F1F1F1] pb-3 text-2xl font-semibold leading-6">User</p>
							<p className="text-md py-3 font-semibold text-[#A3A1A1]">
								<b className="pr-5 text-black">Name: </b>
								{order.user.name}
							</p>
							<p className="text-md font-semibold text-[#A3A1A1]">
								<b className="pr-5 text-black">Email: </b>
								{order.user.email}
							</p>
						</section>
						<section className="flex flex-col rounded-lg border border-[#F1F1F1] p-3">
							<p className="p border-b border-[#F1F1F1] pb-3 text-2xl font-semibold leading-6">
								Order Details
							</p>
							<p className="text-md py-3 font-semibold text-[#A3A1A1]">
								<b className="pr-5 text-black">Order Id: </b>
								{order.id}
							</p>
							<p className="text-md pb-3 font-semibold text-[#A3A1A1]">
								<b className="pr-5 text-black">Order Date: </b>
								{order.createdAt.toLocaleString("en-in", {
									weekday: "short",
									year: "numeric",
									month: "short",
									day: "numeric",
									hour: "numeric",
									minute: "numeric",
								})}
							</p>
							<p className="text-md font-semibold text-[#A3A1A1]">
								<b className="pr-5 text-black">Delivery Date: </b>
								{order.delivery_date?.toDateString() || "Not Scheduled"}
							</p>
						</section>
						<section className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
							<p className="border-b border-[#F1F1F1] pb-3 text-2xl font-semibold">Order Items</p>
							<ul className="flex flex-col gap-2 border-b border-[#F1F1F1]">
								{order.order_items.map((item, ind) => {
									return (
										// eslint-disable-next-line react/jsx-key
										<div
											className="flex flex-col gap-1 rounded-lg border border-[#F1F1F1]"
											key={ind}
										>
											<div className="flex flex-col items-center gap-x-8 gap-y-5 border-b border-[#F1F1F1] p-3 text-center md:flex-row">
												<div className="flex w-full gap-8">
													{(item.frame?.image || item.customization.image) && (
														<>
															<Img
																src={
																	item.customization.image || item.frame?.image || ""
																}
																width={100}
																height={100}
																alt={item.frame?.name || ""}
																className="h-20 w-20 object-contain"
															/>
														</>
													)}
													<div className="w-full text-start">
														<p className="w-full text-xl font-semibold leading-6">
															{item.frame?.name || "No Frame"}
														</p>
														<p className="w-full pb-2 text-base text-[#A3A1A1]">
															{item.customization.type}
														</p>
														{item.customization.image && (
															<Link target="_blank" href={item.customization.image}>
																<Button className="m-0" size={"sm"}>
																	Go to Image&nbsp;
																	<IoMdOpen size={20} />
																</Button>
															</Link>
														)}
													</div>
												</div>
												<div className="flex items-center gap-8 text-center">
													<p className="text-nowrap font-semibold leading-6 md:text-lg">
														₹ {(item.single_unit_price / 100).toFixed(2)}
													</p>
													<p className="font-semibold leading-6 text-[#A3A1A1] md:text-lg">
														x{item.quantity}
													</p>
													<p className="text-nowrap font-semibold leading-6 md:text-lg">
														₹ {((item.single_unit_price * item.quantity) / 100).toFixed(2)}
													</p>
												</div>
											</div>
											<div className="flex flex-wrap justify-start gap-2 border-b border-[#F1F1F1] p-2">
												{(Object.keys(item.customization) as (keyof CartCustomization)[]).map(
													(key) => {
														if (
															(key === "glazing" ||
																key === "backing" ||
																key == "stretching" ||
																key == "sides" ||
																key == "printing" ||
																key == "mirror") &&
															item.customization[key]
														) {
															return (
																<p
																	key={key}
																	className="flex-shrink-0 flex-grow"
																	style={{ flexBasis: "200px" }}
																>
																	<b>{capitalizeFirstLetter(key)}: </b>
																	{item.customization[key]}
																</p>
															);
														}
														return <></>;
													},
												)}
												<p
													className="flex-shrink-0 flex-grow text-nowrap"
													style={{ flexBasis: "200px" }}
												>
													<b>Dimensions: </b>
													{item.customization.width.toFixed(2)}&nbsp;x&nbsp;
													{item.customization.height.toFixed(2)}{" "}
													<strong>
														In<sup>2</sup>
													</strong>
												</p>
											</div>
											{item.customization.mat.length == 0 ? (
												<></>
											) : (
												<div className="flex flex-wrap items-center gap-10 p-3">
													<b className="pb-7">Mat: </b>
													{item.customization.mat.map((mat, ind) => {
														return (
															<div
																className="flex flex-col items-center gap-2 text-center"
																key={ind}
															>
																<TooltipProvider>
																	<Tooltip>
																		<TooltipTrigger asChild>
																			<div
																				className="h-5 w-5 overflow-hidden rounded-md border border-black"
																				style={{ backgroundColor: mat.color }}
																			></div>
																		</TooltipTrigger>
																		<TooltipContent>
																			<p>{mat.color}</p>
																		</TooltipContent>
																	</Tooltip>
																</TooltipProvider>
																<p className="font-semibold">{mat.width.toFixed(2)}</p>
															</div>
														);
													})}
												</div>
											)}
										</div>
									);
								})}
							</ul>
							<div className="flex justify-end gap-2 border-b border-[#F1F1F1] py-3">
								<div className="grid grid-cols-2 gap-x-10">
									<p className="text-lg font-semibold leading-5 text-[#A3A1A1]">Discount</p>
									<p className={`text-end font-semibold leading-6`}>
										{(order.discount / 100).toFixed(2)}
									</p>
									<p className="text-lg font-semibold leading-5 text-[#A3A1A1]">Delivery</p>
									<p className={`text-end font-semibold leading-6`}>
										{(order.delivery_charge / 100).toFixed(2)}
									</p>
									<p className="text-lg font-semibold leading-5 text-[#A3A1A1]">Package</p>
									<p className={`border-b border-[#A3A1A1] text-end font-semibold leading-6`}>
										{(order.packaging / 100).toFixed(2)}
									</p>
									<p className="mt-2 text-xl font-semibold leading-5 text-[#A3A1A1]">Total</p>
									<p className={`mt-2 text-end text-xl font-bold leading-6`}>
										₹{((order.delivery_charge + order.packaging - order.discount) / 100).toFixed(2)}
									</p>
								</div>
							</div>
						</section>
						<section className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
							<div className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
								<p className="border-b border-[#F1F1F1] pb-3 text-2xl font-semibold">
									Update Order Status
								</p>
								<form action={statusUpdateAction} className="grid grid-cols-2 gap-2">
									<div className="hidden">
										<input type="text" name="orderId" value={order.id} />
										<input type="text" name="status" value={status} />
									</div>
									<div>
										<DropDown
											items={Object.keys(OrderStatus)}
											value={status || ""}
											onChange={setStatus}
										/>
										{updateStatusError && (
											<>
												<p className="text-red-400">{updateStatusError}</p>
											</>
										)}
									</div>
									<UpdateButton disabled={status === order.order_status} />
								</form>
							</div>
							<div className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3">
								<p className="border-b border-[#F1F1F1] pb-3 text-2xl font-semibold leading-6">
									Payment
								</p>
								<p
									className={`text-lg font-semibold ${order.transaction == null ? "text-red-400" : ["Attempted", "Created"].includes(order.transaction?.status) ? "text-[#D68D00]" : "text-[#008C0E]"}`}
								>
									{order.transaction == null ? "Uninitiated" : order.transaction?.status}
								</p>
							</div>
							<div className="flex flex-col gap-2 rounded-lg border border-[#F1F1F1] p-3 sm:col-span-2 lg:col-span-1">
								<p className="border-b border-[#F1F1F1] pb-3 text-2xl font-semibold">
									Update Delivery Date
								</p>
								<form action={deliveryUpdateAction} className="grid grid-cols-2 gap-2">
									<div className="hidden">
										<input type="text" name="orderId" value={order.id} />
									</div>
									<div>
										<Input
											type="date"
											name="deliveryDate"
											value={deliveryDate?.toISOString().split("T")[0]}
											onChange={(e) => {
												setDeliveryDate(new Date(e.target.value));
											}}
											className="h-full w-full px-3"
										/>
										{deliveryStatusError && (
											<>
												<p className="text-red-400">{deliveryStatusError}</p>
											</>
										)}
									</div>
									<UpdateButton disabled={order.delivery_date == deliveryDate} />
								</form>
							</div>
						</section>
						<section className="flex flex-col rounded-lg border border-[#F1F1F1] p-3">
							<p className="border-b border-[#F1F1F1] pb-3 text-2xl font-semibold leading-6">
								Delivery Address
							</p>
							<p className="text-md font-semibold text-[#A3A1A1]">{order.shipping_address.name}</p>
							<p className="text-md font-semibold text-[#A3A1A1]">{order.shipping_address.phone}</p>
							<p className="text-md font-semibold text-[#A3A1A1]">{order.shipping_address.addressL1}</p>
							<p className="text-md font-semibold text-[#A3A1A1]">{order.shipping_address.addressL2}</p>
							<p className="text-md font-semibold text-[#A3A1A1]">{order.shipping_address.pincode}</p>
							<p className="text-md font-semibold text-[#A3A1A1]">{order.shipping_address.state}</p>
						</section>
					</>
				)
			)}
		</div>
	);
};

export default OrderDetails;
