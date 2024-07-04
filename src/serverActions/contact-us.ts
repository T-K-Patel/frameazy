"use server"

export async function contactUsAction(state: any, formData: FormData) {
    try {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));
        // Send the form data to the database
        const success = Math.random() > 0.5;
        if (!success) throw new Error("Failed to send message")
        return { data: "Your message has been sent successfully. We will get back to you soon.", error: null };
    } catch {
        return { data: null, error: "Something went wrong while sending your message. Please try again later." }
    }
}