import { CustomError } from "@/lib/CustomError";
import { ServerActionReturnType } from "@/types/serverActionReturnType";

export async function payForAnOrder(): Promise<ServerActionReturnType<boolean>> {
    try {
        return { success: true, data: true };
    } catch (error) {
        if (error instanceof CustomError) {
            return { success: false, error: error.message };
        }
        console.error("payForAnOrder error", error);
        return { success: false, error: "Something went wrong" };
    }
}
