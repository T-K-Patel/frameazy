"use server";
import * as bcrypt from "bcrypt";
import { validateEmail, validatePassword } from "../utils/auth";
import { db } from "../../../prisma/db";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/helpers/mailer";
import { randomBytes } from "crypto";

type signUpActionStateType =
    | {
          error: string;
          success: false;
      }
    | {
          success: true;
          data: {
              email: string;
          };
      };

export async function signUpAction(state: any, formData: FormData): Promise<signUpActionStateType> {
    console.log("signUpAction", state, formData);
    try {
        const name = formData.get("name")?.toString().trim();
        const email = formData.get("email")?.toString().trim().toLowerCase();
        const password = formData.get("password")?.toString().trim();
        const confirmPassword = formData.get("confirmPassword")?.toString().trim();
        if (!name || !email || !password || !confirmPassword) {
            return { error: "All fields are required", success: false };
        }
        if (password !== confirmPassword) {
            return { error: "Password does not match", success: false };
        }
        let error = validateEmail(email) || validatePassword(password);
        if (error) {
            return { error, success: false };
        }
        // validate name
        if (name.length < 3) {
            return { error: "Name must be at least 3 characters long", success: false };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("hashedPassword", hashedPassword);
        const existingUser = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return { error: "User with this email already exists", success: false };
        }

        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        await db.account.create({
            data: {
                userId: user.id,
                provider: "credentials",
                providerAccountId: user.id.toString(),
                type: "credentials",
            },
        });
        const verificationToken = await db.verificationToken.create({
            data: {
                identifier: "verif-" + user.id.toString(),
                token: randomBytes(128).toString("hex"),
                expires: new Date(Date.now() + 1000 * 60 * 20), // 20 minutes
            },
        });
        sendVerificationEmail(email, verificationToken.token);
        console.log("user", user);
        return { success: true, data: { email: user.email! } };
    } catch (error) {
        return { error: "Something went wrong", success: false };
    }
}

type verifyEmailActionStateType =
    | {
          error: string;
          success: false;
      }
    | {
          success: true;
      };

export async function verifyEmailAction(state: any, formData: FormData): Promise<verifyEmailActionStateType> {
    try {
        const email = formData.get("email")?.toString().trim().toLowerCase();
        const token = formData.get("token")?.toString().trim();
        if (!email || !token) {
            return { error: "Invalid verification link", success: false };
        }
        const user = await db.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return { error: "Invalid verification link", success: false };
        }
        const verificationToken = await db.verificationToken.findFirst({
            where: {
                identifier: "verif-" + user.id.toString(),
                token: token,
            },
        });
        if (!verificationToken) {
            return { error: "Invalid verification link", success: false };
        }
        await db.verificationToken.delete({
            where: {
                id: verificationToken.id,
            },
        });
        if (verificationToken.expires < new Date()) {
            return { error: "Token expired", success: false };
        }
        await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                emailVerified: new Date(),
            },
        });
        return { success: true };
    } catch (error) {
        return { error: "Something went wrong", success: false };
    }
}

type forgotPasswordSendMailActionStateType =
    | {
          error: string;
          success: false;
      }
    | {
          success: true;
          data: {
              email: string;
          };
      };

export async function forgotPasswordSendMailAction(
    state: any,
    formData: FormData,
): Promise<forgotPasswordSendMailActionStateType> {
    try {
        const email = formData.get("email")?.toString().trim().toLowerCase();
        if (!email) {
            return { error: "Email is required", success: false };
        }
        let error = validateEmail(email);
        if (error) {
            return { error, success: false };
        }
        const existingUser = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (!existingUser) {
            return { error: "User with this email does not exist", success: false };
        }
        if (!existingUser.password) {
            return {
                error: "You are not allowed to reset password for this account. Please use Google Sign In.",
                success: false,
            };
        }
        const resetToken = await db.verificationToken.create({
            data: {
                identifier: "reset-" + existingUser.id.toString(),
                token: randomBytes(128).toString("hex"),
                expires: new Date(Date.now() + 1000 * 60 * 20), // 20 minutes
            },
        });
        // send email
        sendPasswordResetEmail(email, resetToken.token);
        return { success: true, data: { email: existingUser.email! } };
    } catch (error) {
        return { error: "Something went wrong", success: false };
    }
}

type resetPasswordActionStateType =
    | {
          error: string;
          success: false;
      }
    | {
          success: true;
      };

export async function resetPasswordAction(state: any, formData: FormData): Promise<resetPasswordActionStateType> {
    try {
        const email = formData.get("email")?.toString().trim().toLowerCase();
        const password = formData.get("password")?.toString().trim();
        const confirmPassword = formData.get("confirmPassword")?.toString().trim();
        const token = formData.get("token")?.toString().trim();

        if (!email || !password || !confirmPassword || !token) {
            return { error: "All fields are required", success: false };
        }
        if (password !== confirmPassword) {
            return { error: "Password does not match", success: false };
        }
        let error = validateEmail(email) || validatePassword(password);
        if (error) {
            return { error, success: false };
        }
        const existingUser = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (!existingUser) {
            return { error: "User with this email does not exist", success: false };
        }
        const resetToken = await db.verificationToken.findFirst({
            where: {
                identifier: "reset-" + existingUser.id.toString(),
                token: token,
            },
        });

        if (!resetToken) {
            return { error: "Invalid token", success: false };
        }
        await db.verificationToken.delete({
            where: {
                id: resetToken.id,
            },
        });
        if (resetToken.expires < new Date()) {
            return { error: "Token expired", success: false };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                password: hashedPassword,
            },
        });
        return { success: true }; // TODO: send magic link to login
    } catch (error) {
        return { error: "Something went wrong", success: false };
    }
}
