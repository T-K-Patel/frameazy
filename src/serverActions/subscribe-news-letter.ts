"use server"

export async function subscribeNewsLetterAction(state: any, formData: FormData): Promise<{ data: string | null, error: string | null }> {
    try {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));
        // Send the form data to the database
        const success = Math.random() > 0.5;
        if (!success) throw new Error("Failed to subscribe to newsletter")
        return { data: "You have successfully subscribed to our newsletter.", error: null };
    } catch {
        return { data: null, error: "Something went wrong while subscribing to our newsletter. Please try again later." }
    }
}