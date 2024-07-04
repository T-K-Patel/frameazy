"use server";
import { signOut } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";

export const signOutAction = async () => {
    signOut();
    //redirect("/")
};
