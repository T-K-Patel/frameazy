import { INDEXED_DB_NAME, INDEXED_DB_STORE_NAME } from "@/contants/customizations";
import { useState, useEffect } from "react";

type StoredObject =
	| {
			isExt: false;
			width: number;
			height: number;
			image?: string;
	  }
	| {
			isExt: true;
			width: number;
			height: number;
			src: string;
	  };

const useIndexedDBObjectStorage = () => {
	const [db, setDb] = useState<IDBDatabase | null>(null);
	const [storedObject, setStoredObject] = useState<StoredObject | null>(null);

	// Initialize IndexedDB
	useEffect(() => {
		const request = indexedDB.open(INDEXED_DB_NAME, 1);

		request.onupgradeneeded = (event) => {
			const dbInstance = (event.target as IDBRequest).result;
			if (!dbInstance.objectStoreNames.contains(INDEXED_DB_STORE_NAME)) {
				dbInstance.createObjectStore(INDEXED_DB_STORE_NAME);
			}
		};

		request.onsuccess = (event) => {
			setDb((event.target as IDBRequest).result);
		};

		request.onerror = (event) => {
			console.error("IndexedDB error:", (event.target as IDBRequest).error);
		};
	}, []);

	// Convert JSON to ArrayBuffer
	function jsonToArrayBuffer(json: StoredObject) {
		const jsonString = JSON.stringify(json);
		const encoder = new TextEncoder(); // Encodes string to bytes
		return encoder.encode(jsonString).buffer;
	}

	// Convert ArrayBuffer back to JSON
	function arrayBufferToJson(buffer: ArrayBuffer) {
		const decoder = new TextDecoder(); // Decodes bytes to string
		const jsonString = decoder.decode(buffer);
		return JSON.parse(jsonString) as StoredObject;
	}

	// Store a JSON object in IndexedDB
	const storeObject = (key: string, jsonObject: StoredObject): Promise<void> => {
		return new Promise((resolve, reject) => {
			if (!db) {
				alert("Database not initialized");
				return reject(new Error("Database not initialized"));
			}

			const transaction = db.transaction([INDEXED_DB_STORE_NAME], "readwrite");
			const store = transaction.objectStore(INDEXED_DB_STORE_NAME);
			const request = store.put(jsonToArrayBuffer(jsonObject), key);

			request.onsuccess = () => resolve();
			request.onerror = (event) => {
				alert((event.target as IDBRequest).error);
				reject(new Error((event.target as IDBRequest).error?.message || "Something went wrong"));
			};
		});
	};

	// Retrieve a JSON object from IndexedDB
	const retrieveObject = (key: string): Promise<StoredObject | null> => {
		return new Promise((resolve, reject) => {
			if (!db) {
				return reject(new Error("Database not initialized"));
			}

			const transaction = db.transaction([INDEXED_DB_STORE_NAME], "readonly");
			const store = transaction.objectStore(INDEXED_DB_STORE_NAME);
			const request = store.get(key);

			request.onsuccess = (event) => {
				const result = (event.target as IDBRequest).result;
				if (result) {
					setStoredObject(arrayBufferToJson(result));
					resolve(result);
				} else {
					resolve(null);
				}
			};

			request.onerror = (event) =>
				reject(new Error((event.target as IDBRequest).error?.message || "Something went wrong"));
		});
	};

	return { storeObject, retrieveObject, storedObject, initialized: !!db };
};

export default useIndexedDBObjectStorage;
