import React, { useCallback, useMemo } from "react";

const CANVAS_WIDTH = 2048;
const CANVAS_HEIGHT = CANVAS_WIDTH;
// const CANVAS_HEIGHT = (CANVAS_WIDTH * 3) / 4;
// const INCH_TO_PIXEL = 96;
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

type CanvasProps = {
    // eslint-disable-next-line no-unused-vars
    draw?: (c: CanvasRenderingContext2D) => void;
    className: string;
}

function Canvas({
    draw,
    className,
    ...props
}: CanvasProps) {
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
    const cis = useMemo(() => {
        const _cis = new Image();
        _cis.src = image?.src || "";
        _cis.loading = "eager";
        return _cis;
    }, [image?.src]);

    const frameCIS = useMemo(() => {
        const _cis = new Image()
        _cis.src = frameBorder?.src || "";
        _cis.src = "http://localhost:3000/small_antique_golddd3.jpg";
        _cis.loading = "eager";
        return _cis;
    }, [frameBorder?.src]);

    const SCALE_FACTOR =
        1 / (Math.max((totalSize?.width || 0) / CANVAS_WIDTH, (totalSize?.height || 0) / CANVAS_HEIGHT) * SIZE_FACTOR);

    function clipBorderInTrepezium(
        ctx: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        x3: number,
        y3: number,
        x4: number,
        y4: number,
    ) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.closePath();
        ctx.clip();
    }

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            const wL = new WorkLocation(
                SCALE_FACTOR,
                (CANVAS_WIDTH - totalSize.width * SCALE_FACTOR) / 2,
                (CANVAS_HEIGHT - totalSize.height * SCALE_FACTOR) / 2,
                totalSize.width * SCALE_FACTOR,
                totalSize.height * SCALE_FACTOR,
            );

            // Draw Background with shadow
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowOffsetX = 30;
            ctx.shadowOffsetY = 30;
            ctx.shadowBlur = 50;
            ctx.fillStyle = "white";
            ctx.fillRect(wL.x, wL.y, wL.w, wL.h);
            ctx.shadowBlur = 0;
            ctx.shadowColor = "transparent";

            // Draw Frame
            if (frameBorder) {
                // const frameCIS = new Image();
                // // frameCIS.src = "http://localhost:3000/small_antique_golddd3.jpg";
                // frameCIS.src = "http://localhost:3000/small-brown-gold-875-b.jpg";
                // frameCIS.loading = "eager";

                const fWL = wL.copy();
                fWL.shrink = () => null;
                wL.shrink(frameBorder.borderWidth);

                const drawFrame = () => {
                    const frameThickness = frameBorder.borderWidth * SCALE_FACTOR;
                    // Top border
                    ctx.save();
                    clipBorderInTrepezium(
                        ctx,
                        fWL.x,
                        fWL.y,
                        fWL.x + fWL.w,
                        fWL.y,
                        fWL.x + fWL.w - frameThickness,
                        fWL.y + frameThickness,
                        fWL.x + frameThickness,
                        fWL.y + frameThickness,
                    );
                    ctx.drawImage(frameCIS, fWL.x, fWL.y, fWL.w, frameThickness);
                    ctx.restore();

                    // Left border
                    // ctx.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);
                    ctx.save();
                    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
                    ctx.rotate(-Math.PI / 2);
                    ctx.translate(-CANVAS_HEIGHT / 2, -CANVAS_WIDTH / 2);
                    clipBorderInTrepezium(
                        ctx,
                        fWL.y,
                        fWL.x,
                        fWL.y + fWL.h,
                        fWL.x,
                        fWL.y + fWL.h - frameThickness,
                        fWL.x + frameThickness,
                        fWL.y + frameThickness,
                        fWL.x + frameThickness,
                    );
                    ctx.drawImage(frameCIS, fWL.y, fWL.x, fWL.h, frameThickness);
                    ctx.restore();

                    // Bottom border
                    ctx.save();
                    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
                    ctx.rotate(Math.PI);
                    ctx.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);
                    clipBorderInTrepezium(
                        ctx,
                        fWL.x,
                        fWL.y,
                        fWL.x + fWL.w,
                        fWL.y,
                        fWL.x + fWL.w - frameThickness,
                        fWL.y + frameThickness,
                        fWL.x + frameThickness,
                        fWL.y + frameThickness,
                    );
                    ctx.drawImage(frameCIS, fWL.x, fWL.y, fWL.w, frameThickness);
                    ctx.restore();

                    // Right border
                    ctx.save();
                    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
                    ctx.rotate(Math.PI / 2);
                    ctx.translate(-CANVAS_HEIGHT / 2, -CANVAS_WIDTH / 2);
                    clipBorderInTrepezium(
                        ctx,
                        fWL.y,
                        fWL.x,
                        fWL.y + fWL.h,
                        fWL.x,
                        fWL.y + fWL.h - frameThickness,
                        fWL.x + frameThickness,
                        fWL.y + frameThickness,
                        fWL.x + frameThickness,
                    );
                    ctx.drawImage(frameCIS, fWL.y, fWL.x, fWL.h, frameThickness);
                    ctx.restore();
                    ctx.save();
                };

                drawFrame();
                frameCIS.onload = drawFrame;
            }

            function drawMat(color: string, width: number) {
                ctx.fillStyle = color;
                ctx.fillRect(wL.x, wL.y, wL.w, wL.h);
                wL.shrink(width);
            }

            [...(matOptions || [])].reverse().map((option) => {
                drawMat(option.color, option.width);
            });
            ctx.fillStyle = "white";
            ctx.fillRect(wL.x, wL.y, wL.w, wL.h);
            if (image) {
                // Draw Image
                ctx.drawImage(cis, wL.x, wL.y, wL.w, wL.h);
                cis.onload = () => {
                    // Draw Image
                    ctx.drawImage(cis, wL.x, wL.y, wL.w, wL.h);
                };
            }
        },
        [SCALE_FACTOR, totalSize.width, totalSize.height, frameBorder, matOptions, image, frameCIS, cis],
    );

    return (
        <>
            <Canvas className="my-auto- mx-auto w-full max-w-[600px]" draw={draw} />
        </>
    );
};

export default FrameCanvas;
