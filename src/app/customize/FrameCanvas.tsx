import React, { useCallback, useEffect, useMemo, useRef } from "react";

const CANVAS_WIDTH = 2048;
const CANVAS_HEIGHT = (CANVAS_WIDTH * 3) / 4;
const INCH_TO_PIXEL = 96;
const SIZE_FACTOR = 1.1;

type FrameCanvasProps = {
    image?: { src: string; width: number; height: number };
    frameBorder?: { src: string; borderWidth: number };
    matOptions?: { width: number; color: string }[];
    // stretching?: string;
    // sides?: string;
    totalSize: {
        width: number;
        height: number;
    };
    isMirror?: boolean;

};

// https://09vt97f6-3000.inc1.devtunnels.ms/

function Canvas({
    draw,
    className,
    ...props
}: {
    draw?: (context: CanvasRenderingContext2D) => void;
    className: string;
}) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    React.useEffect(() => {
        const context = canvasRef.current?.getContext("2d");
        if (!context) return;
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        draw && draw(context);
    }, [draw]);

    return <canvas ref={canvasRef} className={className} {...props} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />;
}

class WorkLocation {
    scale: number;
    x: number;
    y: number;
    w: number;
    h: number;


    public constructor(scale: number, x: number, y: number, w: number, h: number) {
        this.scale = scale;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    public getRightX(thickness: number): number {
        return this.x + this.w - thickness * this.scale;
    }

    public getBottomY(thickness: number): number {
        return this.y + this.h - thickness * this.scale;
    }

    public shrink(thickness: number) {
        this.x += thickness * this.scale;
        this.y += thickness * this.scale;
        this.w -= thickness * 2 * this.scale;
        this.h -= thickness * 2 * this.scale;
    }

    public copy(): WorkLocation {
        return new WorkLocation(this.scale, this.x, this.y, this.w, this.h);
    }
}

const FrameCanvas = ({ image, totalSize, frameBorder, matOptions }: FrameCanvasProps) => {
    /**
     * SF*th<ch
     * SF*tw<cw
     */
    const cis = useMemo(() => new Image(), []);
    // cis.src = image?.src || "";
    // cis.src = "https://admin.walraft.com/uploads/frames/small-brown-gold-875-b.jpg";
    cis.src = "http://localhost:3000/small_antique_golddd3.jpg";
    const SCALE_FACTOR = 1 / (Math.max((totalSize?.width || 0) / CANVAS_WIDTH, (totalSize?.height || 0) / CANVAS_HEIGHT) *
        SIZE_FACTOR);



    const draw = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            const wL = new WorkLocation(SCALE_FACTOR, (CANVAS_WIDTH - totalSize.width * SCALE_FACTOR) / 2, (CANVAS_HEIGHT - totalSize.height * SCALE_FACTOR) / 2, totalSize.width * SCALE_FACTOR, totalSize.height * SCALE_FACTOR);

            function clipBorderInTrepezium(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);
                ctx.lineTo(x4, y4);
                ctx.closePath();
                ctx.clip();
            }

            // Draw Frame
            if (frameBorder) {
                const frameCIS = new Image();
                frameCIS.src = cis.src;
                // Fill the frame with the image
                const fWL = wL.copy();
                wL.shrink(frameBorder.borderWidth);

                const drawFrame = () => {
                    const frameThickness = frameBorder.borderWidth * SCALE_FACTOR;
                    // Top border
                    ctx.save();
                    clipBorderInTrepezium(ctx,
                        fWL.x, fWL.y,
                        fWL.x + fWL.w, fWL.y,
                        fWL.x + fWL.w - frameThickness, fWL.y + frameThickness,
                        fWL.x + frameThickness, fWL.y + frameThickness);
                    ctx.drawImage(frameCIS, fWL.x, fWL.y, fWL.w, frameThickness);
                    ctx.restore();

                    // Left border
                    // ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
                    // ctx.rotate(Math.PI / 2);
                    // ctx.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);
                    ctx.save();
                    clipBorderInTrepezium(ctx,
                        fWL.x, fWL.y,
                        fWL.x, fWL.getBottomY(0),
                        fWL.x + frameThickness, fWL.getBottomY(frameBorder.borderWidth),
                        fWL.x + frameThickness, fWL.y + frameThickness
                    );
                    ctx.drawImage(frameCIS, fWL.x, fWL.y, fWL.w, fWL.h);
                    ctx.restore();

                    // Bottom border
                    ctx.save();
                    clipBorderInTrepezium(ctx,
                        fWL.x, fWL.getBottomY(0),
                        fWL.x + frameThickness, fWL.getBottomY(frameBorder.borderWidth),
                        fWL.getRightX(frameBorder.borderWidth), fWL.getBottomY(frameBorder.borderWidth),
                        fWL.getRightX(0), fWL.getBottomY(0)
                    );
                    ctx.drawImage(frameCIS, fWL.x, fWL.y, fWL.w, fWL.h);
                    ctx.restore();

                    // Right border
                    ctx.save();
                    clipBorderInTrepezium(ctx,
                        fWL.getRightX(0), fWL.y,
                        fWL.getRightX(frameBorder.borderWidth), fWL.y + frameThickness,
                        fWL.getRightX(frameBorder.borderWidth), fWL.getBottomY(frameBorder.borderWidth),
                        fWL.getRightX(0), fWL.getBottomY(0)
                    );
                    ctx.drawImage(frameCIS, fWL.x, fWL.y, fWL.w, fWL.h);
                    ctx.restore();
                    ctx.save();
                }

                drawFrame();
                frameCIS.onload = drawFrame;
            }

            function drawMat(color: string, width: number) {
                ctx.fillStyle = color;
                ctx.fillRect(wL.x, wL.y, wL.w, wL.h);
                wL.shrink(width);
            }

            [...(matOptions || [])].reverse().map((option) => {
                drawMat(option.color, option.width)
            });

            if (image) {
                // Draw Image
                // ctx.drawImage(cis, wL.x, wL.y, wL.w, wL.h);
                // cis.onload = () => {
                //     // Draw Image
                //     ctx.drawImage(cis, wL.x, wL.y, wL.w, wL.h);
                // }
            }
            // ctx.shadowColor = '#000a'; // Shadow color
            // ctx.shadowBlur = 25;                   // Shadow blur level
            // ctx.shadowOffsetX = 10;                // Horizontal shadow offset
            // ctx.shadowOffsetY = 10;                // Vertical shadow offset
        },
        [SCALE_FACTOR, totalSize.width, totalSize.height, frameBorder, matOptions, image, cis],
    );

    return (
        <>
            <Canvas className="mx-auto my-auto- w-full max-w-full border border-black" draw={draw} />
        </>
    );
};

export default FrameCanvas;