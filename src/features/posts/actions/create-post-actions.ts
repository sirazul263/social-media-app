"use server";

import { validateRequest } from "@/lib/auth";
import { createPostSchema } from "../schemas";
import prisma from "@/lib/prisma";
import { getPostsDataInclude } from "@/lib/types";

export async function createPost(input: {
  content: string;
  mediaIds: string[]; // Add mediaIds to the input type if needed.
}) {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content, mediaIds } = createPostSchema.parse(input);
  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      attachment: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getPostsDataInclude(user.id),
  });
  return newPost;
}
