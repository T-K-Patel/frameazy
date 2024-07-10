import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: User;
        data: string;
    }

    interface User {
        id: string;
        name: string;
        email: string;
        emailVerified?: boolean;
    }

    interface Credentials {
        email: string;
        password: string;
    }

    interface Profile {
        name: string;
        email: string;
        email_verified: boolean;
    }
}
