"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude } from "@/lib/types";

export async function deleteComment(id: string) {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const comment = await prisma.comment.findUnique({
    where: { id },
  });
  if (!comment) {
    throw new Error("Comment not found");
  }
  if (comment.userId !== user.id) {
    throw new Error("Unauthorized");
  }
  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });
  return deletedComment;
}
