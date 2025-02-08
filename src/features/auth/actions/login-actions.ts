"use server";

import { loginSchema, LoginValues } from "@/features/auth/schemas";
import { lucia } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(credentials: LoginValues) {
  try {
    const { password, username } = loginSchema.parse(credentials);
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });
    if (!existingUser || !existingUser.passwordHash) {
      return { error: "Invalid credentials" };
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      timeCost: 2,
      memoryCost: 19456,
      parallelism: 1,
      outputLen: 32,
    });

    if (!validPassword) {
      return { error: "Invalid password" };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    const cookieStore = await cookies();
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return { success: true }; // ✅ Return success instead of redirecting
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again" };
  }
}
