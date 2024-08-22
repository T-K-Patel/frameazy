import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    // Send a html content with a form to unsubscribe
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
        return new NextResponse("Invalid token", { status: 400 });
    }
    return new NextResponse(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unsubscribe</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            form {
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                max-width: 400px;
                width: 100%;
            }
            h1 {
                margin-bottom: 20px;
                font-size: 24px;
                color: #333;
                text-align: center;
            }
            p {
                margin-bottom: 20px;
                color: #666;
                text-align: center;
            }
            input[type="hidden"] {
                display: none;
            }
            button {
                display: block;
                width: 100%;
                padding: 10px;
                background-color: #e74c3c;
                border: none;
                border-radius: 5px;
                color: #fff;
                font-size: 16px;
                cursor: pointer;
            }
            button:hover {
                background-color: #c0392b;
            }
        </style>
    </head>
    <body>
        <form action="" method="post">
            <h1>Unsubscribe</h1>
            <p>You will not receive newsletter anymore</p>
            <button type="submit">Unsubscribe</button>
        </form>
    </body>
    </html>
`, { headers: { "Content-Type": "text/html" } });
}

export async function POST(req: NextRequest) {
    // Unsubscribe the user
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
        return new NextResponse("Invalid token", { status: 400 });
    }
    // Unsubscribe the user
    try {
        const dlt = await db.subscription.update({ where: { unsubscribeToken: token }, data: { status: "Unsubscribed" } });
        if (dlt) {
            return new NextResponse("Unsubscribed successfully", { status: 200 });
        } else {
            return new NextResponse("Invalid token", { status: 400 });
        }
    } catch (error) {
        return new NextResponse("Error unsubscribing", { status: 500 });
    }
}