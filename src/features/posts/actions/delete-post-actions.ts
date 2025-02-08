"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getPostsDataInclude } from "@/lib/types";

export async function deletePost(id: string) {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Error("Post not found");
  }
  if (post.userId !== user.id) {
    throw new Error("Unauthorized");
  }
  const deletePost = await prisma.post.delete({
    where: { id },
    include: getPostsDataInclude(user.id),
  });

  return deletePost;
}
