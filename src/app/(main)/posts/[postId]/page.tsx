import { Post } from "@/features/posts/components/post";
import { UserInfoSidebar } from "@/features/posts/components/user-info-sidebar";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getPostsDataInclude } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

interface PageProps {
  params: {
    postId: string;
  };
}
const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostsDataInclude(loggedInUserId),
  });
  if (!post) {
    notFound();
  }
  return post;
});

export async function generateMetaData({
  params,
}: PageProps): Promise<Metadata> {
  const { postId } = await params;
  const { user } = await validateRequest();
  if (!user) {
    return {};
  }
  const post = await getPost(postId, user.id);

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}

export default async function PostDetailsPage({ params }: PageProps) {
  const { postId } = await params;
  const { user } = await validateRequest();

  if (!user) {
    return (
      <p className="text-destructive">You are not allowed to view this page</p>
    );
  }
  const post = await getPost(postId, user.id);
  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.5rem] hidden lg:block h-fit w-80 flex-none">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
}
