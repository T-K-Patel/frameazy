"use client";
import { useState, useEffect } from "react";
import { Subscription, SubscriptionStatus } from "@prisma/client";
import { getSubscriptionsAction } from "@/serverActions/admin/admin.action";
import { Skeleton } from "@/components/ui/skeleton";

const AdminSubscriptionPage = () => {
	const [subscriptions, setSubscriptions] = useState<Omit<Subscription, "unsubscribeToken">[]>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		getSubscriptionsAction()
			.then((data) => {
				if (data.success) {
					setSubscriptions(data.data);
					setError(null);
				} else {
					setError(data.error);
					setSubscriptions([]);
				}
			})
			.catch((error) => {
				setError(error);
				setSubscriptions([]);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);
	return (
		<div className="mx-auto flex w-11/12 max-w-screen-2xl flex-col gap-y-12 py-12">
			<section className="flex flex-col gap-6 rounded-3xl border border-[#F1F1F1] p-3">
				<h1 className="leading-12 pb-5 text-2xl font-semibold">Subscriptions</h1>
				{loading ? (
					<div className="flex flex-col gap-2">
						<Skeleton className="md:h-18 h-10 rounded-xl" />
						<Skeleton className="md:h-18 h-10 rounded-xl" />
						<Skeleton className="md:h-18 h-10 rounded-xl" />
						<Skeleton className="md:h-18 h-10 rounded-xl" />
					</div>
				) : error || subscriptions?.length == 0 ? (
					<p className="text-center text-lg font-semibold text-red-500">{error ?? "No subscriptions yet"}</p>
				) : (
					<div className="w-full overflow-x-auto">
						<table className="w-full">
							<tbody className="w-full">
								{subscriptions?.map((s, ind) => {
									return (
										<tr
											key={ind}
											className="w-fit items-center gap-x-8 rounded-lg border-b border-[#F1F1F1] *:p-3"
										>
											<td className="text-nowrap text-center font-semibold md:text-xl">
												{ind + 1}
											</td>
											<td className="text-nowrap text-center font-semibold md:text-xl">
												{s.email}
											</td>
											<td className="text-nowrap text-center font-semibold md:text-xl">
												{s.createdAt.toLocaleString("en-in", {
													weekday: "short",
													year: "numeric",
													month: "short",
													day: "numeric",
													hour: "numeric",
													minute: "numeric",
												})}
											</td>
											<td
												className={`text-nowrap text-center font-semibold md:text-xl ${s.status === SubscriptionStatus.Subscribed ? "text-green-500" : "text-red-500"}`}
											>
												{s.status}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</section>
		</div>
	);
};

export default AdminSubscriptionPage;
