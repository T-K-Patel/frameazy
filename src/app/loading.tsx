import React from "react";

function Loading() {
    return (
        <div className="mx-auto flex flex-col items-center justify-center gap-3 bg-white py-10">
            <h1 className="text-4xl font-bold">Loading...</h1>
            {/* Spinning Circular progress bar */}
            <svg
                className="mx-auto h-12 w-12 animate-spin text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2"
                ></path>
            </svg>
        </div>
    );
}

export default Loading;
