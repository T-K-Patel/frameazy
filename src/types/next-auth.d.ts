/* eslint-disable no-unused-vars */
import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user?: User;
    }

    interface User {
        id: string;
        name: string;
        email: string;
        image: string;
        role: Role;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
    }
}
