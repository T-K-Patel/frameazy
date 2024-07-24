"use client";
import { useSession } from "next-auth/react";
import React, { createContext, ReactNode, useEffect, useState } from "react";

type FrameOptions =
    | { framingStyle: "none"; data?: null }
    | {
          framingStyle: "uploadAndFrame";
          data: {
              image?: File | string;
              croppedImage?: File | string;
              frameType?: "printOnly" | "canvasPrint" | "framedWithoutMG" | "framedWithMG";
          };
      }
    | {
          framingStyle: "emptyFrame";
          data: {
              frameType?: "canvas|panel" | "paper";
          };
      }
    | {
          framingStyle: "mirrorFrame";
          data: {};
      };

const isFrameOptions = (obj: any): obj is FrameOptions => {
    if (obj && typeof obj === "object") {
        switch (obj.framingStyle) {
            case "none":
                return obj.data === undefined || obj.data === null;
            case "uploadAndFrame":
                return (
                    obj.data &&
                    (typeof obj.data.image === "string" ||
                        obj.data.image instanceof File ||
                        obj.data.image === undefined) &&
                    (typeof obj.data.croppedImage === "string" ||
                        obj.data.croppedImage instanceof File ||
                        obj.data.croppedImage === undefined) &&
                    (obj.data.frameType === "printOnly" ||
                        obj.data.frameType === "canvasPrint" ||
                        obj.data.frameType === "framedWithoutMG" ||
                        obj.data.frameType === "framedWithMG" ||
                        obj.data.frameType === undefined)
                );
            case "emptyFrame":
                return (
                    obj.data &&
                    (obj.data.frameType === "canvas|panel" ||
                        obj.data.frameType === "paper" ||
                        obj.data.frameType === undefined)
                );
            case "mirrorFrame":
                return obj.data && typeof obj.data === "object";
            default:
                return false;
        }
    }
    return false;
};

const retrieveFrameOptions = (key: string): FrameOptions | null => {
    if (typeof window !== "undefined") {
        const jsonString = localStorage.getItem(key);
        if (jsonString) {
            try {
                const parsed: unknown = JSON.parse(jsonString);
                if (isFrameOptions(parsed)) {
                    return parsed;
                } else {
                    console.error("Validation failed: Invalid frame options structure.");
                }
            } catch (e) {
                console.error("Failed to parse frame options from localStorage", e);
            }
        }
    }
    return null;
};

// Create a new context for the frame options data
const FramesContext = createContext<
    | {
          frameOptions: FrameOptions;
          setFrameOptions: React.Dispatch<React.SetStateAction<FrameOptions>>;
          resetFrames: () => void;
      }
    | undefined
>(undefined);

const StorageKey = "frameOptions";

function FramesProvider({ children }: { children: ReactNode }) {
    const session = useSession();

    const [frameOptions, setFrameOptions] = useState<FrameOptions>(
        retrieveFrameOptions(StorageKey) || { framingStyle: "none" },
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(StorageKey, JSON.stringify(frameOptions));
        } else {
            console.error("Failed to store frame options in localStorage");
        }
    }, [frameOptions]);

    if (session.status == "loading") {
        return <></>;
    }

    function resetFrames() {
        setFrameOptions({ framingStyle: "none" });
    }
    return (
        <FramesContext.Provider value={{ frameOptions, setFrameOptions, resetFrames }}>
            {children}
        </FramesContext.Provider>
    );
}

export function useFrames() {
    const context = React.useContext(FramesContext);
    if (context === undefined) {
        throw new Error("useFrames must be used within a FramesProvider");
    }
    return context;
}

export { FramesProvider };
