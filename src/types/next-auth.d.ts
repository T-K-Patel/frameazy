import { DefaultSession, JWT as NextJwt } from "next-auth";

declare module "next-auth" {
    interface Session {
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
        id: string;
        name: string;
        email: string;
        email_verified: boolean;
    }

    interface JWT extends NextJwt {
        id: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
    }
}
