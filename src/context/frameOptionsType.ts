export type FrameOptions =
    | { framingStyle: "none"; data?: null }
    | {
          framingStyle: "uploadAndFrame";
          data: {
              image?: File | string;
              croppedImage?: File | string;
              width?: number;
              height?: number;
              customization?:
                  | {
                        type: "printOnly";
                        printing: string;
                    }
                  | {
                        type: "canvasPrint";
                        printing: string;
                        stretching: string;
                        sides: string;
                    }
                  | {
                        type: "framedWithoutMG";
                        frame_id: string;
                        printing: string;
                        stretching: string;
                    }
                  | {
                        type: "framedWithMG";
                        frame_id: string;
                        glazing: string; // LATER: replace this with enum of prisma.
                        printing: string;
                        backing: string;
                        mat: { key: string; width: number; color: string }[];
                    };
          };
      }
    | {
          framingStyle: "emptyFrame";
          data: {
              customization?:
                  | {
                        type: "canvas|panel";
                        frame_id: string;
                    }
                  | {
                        type: "paper";
                        width: number;
                        height: number;
                        frame_id: string;
                        glazing: string; // LATER: replace this with enum of prisma.
                        mat: { key: string; width: number; color: string }[];
                    };
          };
      }
    | {
          framingStyle: "mirrorFrame";
          data: {};
      };
