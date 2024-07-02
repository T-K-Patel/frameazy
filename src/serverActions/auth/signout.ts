"use server"
import { cookies } from "next/headers";

export const signOutAction = async () => {
    cookies().delete("session_id");
    // redirect("/");
}

