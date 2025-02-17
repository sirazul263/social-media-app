"use client";

import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { InfiniteScrollContainer } from "@/components/infinite-scroll-container";
import { LoadingSkeleton } from "@/features/posts/components/loading-skeleton";
import { Post } from "@/features/posts/components/post";

interface SearchMainProps {
  query: string;
}

export const SearchMain = ({ query }: SearchMainProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "search", query],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("/api/search", {
          searchParams: {
            q: query,
            ...(pageParam ? { cursor: pageParam } : {}),
          },
        })
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    gcTime: 0,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <LoadingSkeleton />;
  }
  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No post found for this query
      </p>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center text-destructive">
        An error occurred while search
      </div>
    );
  }
  return (
    <InfiniteScrollContainer
      className="space-y-5 "
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}

      {isFetchingNextPage && <LoadingSkeleton />}
    </InfiniteScrollContainer>
  );
};
