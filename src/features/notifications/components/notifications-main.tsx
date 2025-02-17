"use client";

import { NotificationsPage } from "@/lib/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { InfiniteScrollContainer } from "@/components/infinite-scroll-container";
import { LoadingSkeleton } from "@/features/posts/components/loading-skeleton";
import { Notification } from "./notification";
import { useEffect } from "react";

export const NotificationsMain = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/notifications",
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<NotificationsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch("/api/notifications/mark-as-read"),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    onError: (error) => {
      console.log("Failed to mark notifications as read", error);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  if (status === "pending") {
    return <LoadingSkeleton />;
  }
  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        You do not have any notification
      </p>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center text-destructive">
        An error occurred while fetching notification
      </div>
    );
  }
  return (
    <InfiniteScrollContainer
      className="space-y-5 "
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}

      {isFetchingNextPage && <LoadingSkeleton />}
    </InfiniteScrollContainer>
  );
};
