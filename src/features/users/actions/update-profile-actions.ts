"use server";

import { validateRequest } from "@/lib/auth";
import { updateProfileSchema, UpdateProfileValues } from "../schemas";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";

export const updateProfile = async (values: UpdateProfileValues) => {
  const validatedValues = updateProfileSchema.parse(values);
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: validatedValues,
    select: getUserDataSelect(user.id),
  });
  return updatedUser;
};
