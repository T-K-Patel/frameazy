import { useSession } from "next-auth/react";
import React, { createContext, ReactNode, useState } from "react";

// Define the shape of the frame options data
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

// Create a new context for the frame options data
const FramesContext = createContext<
    | {
          frameOptions: FrameOptions;
          setFrameOptions: React.Dispatch<React.SetStateAction<FrameOptions>>;
          resetFrames: () => void;
      }
    | undefined
>(undefined);

function FramesProvider({ children }: { children: ReactNode }) {
    const session = useSession();

    const [frameOptions, setFrameOptions] = useState<FrameOptions>({ framingStyle: "none" });

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
