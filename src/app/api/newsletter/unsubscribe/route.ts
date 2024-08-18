import { NextResponse } from "next/server";

export async function GET() {
    // Send a html content with a form to unsubscribe
    return new NextResponse(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <!-- Modern Styled Form with styling with just a button saying unsubscribe -->
            <form action="unsubscribe.php" method="post">
                <h1>Unsubscribe</h1>
                <p>Enter your email address to unsubscribe from our mailing list</p>
                <input type="email" name="email" placeholder="Email Address" required>
                <button type="submit">Unsubscribe</button>
            </form>
        </body>
        </html>
    `, { headers: { "Content-Type": "text/html" } });
}

export async function POST() {
    // Unsubscribe the user
    return new NextResponse("Unsubscribed", { status: 200 });
}