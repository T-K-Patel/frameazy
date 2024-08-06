import React, { useCallback, useEffect, useRef } from "react";

const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = (512 * 3) / 4;
const INCH_TO_PIXEL = 96;
const SIZE_FACTOR = 1.1;

type FrameCanvasProps = {
    image?: { src: string; width: number; height: number };
    frameBorder?: { src: string; borderWidth: number };
    matOptions?: { width: number; color: string }[];
    // stretching?: string;
    // sides?: string;
    totalSize?: {
        width: number;
        height: number;
    };
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

const FrameCanvas = ({ image, totalSize }: FrameCanvasProps) => {
    /**
     * SF*th<ch
     * SF*tw<cw
     */
    const SCALE_FACTOR = 1 / (Math.max((((totalSize?.width || 0)) / CANVAS_WIDTH), (((totalSize?.height || 0)) / CANVAS_HEIGHT),) * SIZE_FACTOR * INCH_TO_PIXEL);

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            const cis = new Image();
            cis.src = image?.src || "https://via.placeholder.com/512";
            console.log(cis);
            ctx.drawImage(cis, CANVAS_WIDTH / 4, CANVAS_HEIGHT / 4, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            ctx.fillStyle = "red";
            ctx.fillRect(CANVAS_WIDTH / 4 - 50, CANVAS_HEIGHT / 4 - 30, 30, (CANVAS_HEIGHT * 3) / 4);
        },
        [image],
    );

    return (
        <>
            <Canvas className="mx-auto my-auto max-w-full border border-black" draw={draw} />
        </>
    );
};

export default FrameCanvas;
