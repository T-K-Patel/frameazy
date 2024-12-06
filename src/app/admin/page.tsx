"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

function AdminHome() {
	const [modal, setModal] = useState(null as string | null); // "category", "color", "collection", or null
	const [name, setName] = useState("");

	const users_name = useSession().data?.user?.name;

	const openModal = (type: string) => {
		setModal(type);
		setName("");
	};

	const closeModal = () => {
		setModal(null);
		setName("");
	};

	const handleSave = () => {
		if (name.trim() === "") {
			alert("Name cannot be empty");
			return;
		}
		// Trigger server action
		console.log(`Saving ${modal}:`, name);
		closeModal();
	};

	return (
		<div className="p-8">
			<header className="mb-8">
				<h1 className="text-2xl font-medium">
					Welcome<span className="font-bold"> {users_name}</span>
				</h1>
				<p className="text-gray-600">Manage categories, colors, collections, and products</p>
			</header>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<button
					className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					onClick={() => openModal("category")}
				>
					Add Category
				</button>
				<button
					className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
					onClick={() => openModal("color")}
				>
					Add Color
				</button>
				<button
					className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
					onClick={() => openModal("collection")}
				>
					Add Collection
				</button>
				<button
					className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
					// onClick={() => router.push("/admin/add-product")}
				>
					Add Product
				</button>
			</div>

			{modal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-96 rounded bg-white p-6 shadow-md">
						<h2 className="mb-4 text-xl font-semibold">Add {modal}</h2>
						<input
							type="text"
							placeholder={`Enter ${modal} name`}
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="mb-4 w-full rounded border p-2"
						/>
						<div className="flex justify-end gap-2">
							<button
								className="rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
								onClick={closeModal}
							>
								Cancel
							</button>
							<button
								className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
								onClick={handleSave}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default AdminHome;
