"use client";
import Loading from "@/app/loading";
import CustomizationDialog from "@/components/customizing/CustomizationDialog";
import { useSession } from "next-auth/react";
import React, { createContext, ReactNode, useState } from "react";

type FrameOptions =
    | { framingStyle: "none"; data?: null }
    | {
          framingStyle: "uploadAndFrame";
          data: {
              image?: string;
              croppedImage?: string;
              usingExternalImage?: boolean;
              width?: number;
              height?: number;
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

type CustomizingFrameType = {
    id: string;
    borderWidth: number;
    borderSrc: string;
    name: string;
    unit_price: number;
};

// Create a new context for the frame options data
const FramesContext = createContext<
    | {
          frameOptions: FrameOptions;
          setFrameOptions: React.Dispatch<React.SetStateAction<FrameOptions>>;
          resetFrames: () => void;
          dialogOpen: boolean;
          setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
          customizingFrame: CustomizingFrameType | null;
          setCustomizingFrame: React.Dispatch<React.SetStateAction<CustomizingFrameType | null>>;
      }
    | undefined
>(undefined);

function FramesProvider({ children }: { children: ReactNode }) {
    const session = useSession();
    const [frameOptions, setFrameOptions] = useState<FrameOptions>({ framingStyle: "none" });
    const [dialogOpen, setDialogOpen] = useState(false);

    const [customizingFrame, setCustomizingFrame] = useState<CustomizingFrameType | null>(null);

    if (session.status == "loading") {
        return <Loading />;
    }

    function resetFrames() {
        setFrameOptions({ framingStyle: "none" });
    }
    return (
        <FramesContext.Provider
            value={{
                frameOptions,
                setFrameOptions,
                resetFrames,
                setDialogOpen,
                dialogOpen,
                customizingFrame,
                setCustomizingFrame,
            }}
        >
            {children}
            {frameOptions && (
                <CustomizationDialog
                    frameOptions={frameOptions}
                    setDialogOpen={setDialogOpen}
                    dialogOpen={dialogOpen}
                    setFrameOptions={setFrameOptions}
                    resetFrames={resetFrames}
                    customizingFrame={customizingFrame}
                    setCustomizingFrame={setCustomizingFrame}
                />
            )}
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
