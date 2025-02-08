"use server";

import { signUpSchema, SignUpValues } from "@/features/auth/schemas";
import { lucia } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";

export async function signUp(credentials: SignUpValues) {
  try {
    const { email, password, username } = signUpSchema.parse(credentials);
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      parallelism: 1,
      outputLen: 32,
      timeCost: 2,
    });
    const userId = generateIdFromEntropySize(10);

    const existingUserName = await prisma.user.findFirst({
      where: { username: { equals: username, mode: "insensitive" } },
    });

    if (existingUserName) {
      return { error: "Username already exists" };
    }

    const existingEmail = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (existingEmail) {
      return { error: "Email already exists" };
    }

    await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName: username,
        email,
        passwordHash,
      },
    });

    const session = await lucia.createSession(userId, {});
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
