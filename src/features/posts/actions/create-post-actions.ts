"use server";

import { validateRequest } from "@/lib/auth";
import { createPostSchema } from "../schemas";
import prisma from "@/lib/prisma";
import { getPostsDataInclude } from "@/lib/types";

export async function createPost(input: string) {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content } = createPostSchema.parse({ content: input });
  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
    include: getPostsDataInclude(user.id),
  });
  return newPost;
}
