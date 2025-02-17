"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createCommentSchema } from "../schemas";
import { getCommentDataInclude, PostData } from "@/lib/types";

export async function submitComment({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content: contentValidated } = createCommentSchema.parse({ content });

  const [newComment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content: contentValidated,
        postId: post.id,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    //Notifications
    ...(post.user.id !== user.id
      ? [
          prisma.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.user.id,
              type: "COMMENT",
              postId: post.id,
            },
          }),
        ]
      : []),
  ]);

  return newComment;
}
