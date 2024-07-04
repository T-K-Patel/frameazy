"use server"

import { db } from "../../prisma/db";

export async function contactUsAction(state: any, formData: FormData) {

    try {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));
        const success=await db.message.create({
            data:{
                id:Math.random().toString(),
               name:formData.get("name")?.toString()||"",
                email:formData.get("email")?.toString()||"",
                message:formData.get("message")?.toString()||""
            }
        })
        if (!success) throw new Error("Failed to send message")
        return { data: "Your message has been sent successfully. We will get back to you soon.", error: null };
    } catch {
        return { data: null, error: "Something went wrong while sending your message. Please try again later." }
    }
}