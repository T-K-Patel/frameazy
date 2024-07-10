"use server";
import { signOut } from "next-auth/react";

export const signOutAction = async () => {
    signOut();
};
