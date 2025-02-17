"use client";
import { UserAvatar } from "@/components/user-avatar";
import { useSession } from "@/hooks/session-provider";
import { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import { PostMoreButton } from "./post-more-button";
import { Linkify } from "@/components/linkify";
import { UserTooltip } from "@/features/users/components/user-tooltip";
import { MediaPreview } from "./media-preview";
import { LikeButton } from "@/features/likes/components/like-button";
import { BookmarkButton } from "@/features/bookmarks/components/bookmark-button";
import { useState } from "react";
import { CommentButton } from "@/features/comments/components/comment-button";
import { CommentSection } from "@/features/comments/components/comment-section";

interface PostDataProps {
  post: PostData;
}

export const Post = ({ post }: PostDataProps) => {
  const { user } = useSession();

  const [showComments, setShowComments] = useState(false);

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user.id === user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachment.length && (
        <MediaPreview attachment={post.attachment} />
      )}
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some((like) => like.userId === user.id),
            }}
          />
          <CommentButton
            post={post}
            onClick={() => setShowComments(!showComments)}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id
            ),
          }}
        />
      </div>
      {showComments && <CommentSection post={post} />}
    </article>
  );
};
