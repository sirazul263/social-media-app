"use client";
import { BookmarkInfo } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookmarkInfo } from "../hooks/use-bookmark-info";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export const BookmarkButton = ({
  postId,
  initialState,
}: BookmarkButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data } = useBookmarkInfo(postId, initialState);

  const { mutate } = useMutation({
    mutationFn: async () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmarks`)
        : kyInstance.post(`/api/posts/${postId}/bookmarks`),
    onMutate: async () => {
      toast({
        description: `Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`,
      });
      const queryKey: QueryKey = ["bookmark-info", postId];

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);
      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousState) {
        queryClient.setQueryData<BookmarkInfo>(
          ["bookmark-info", postId],
          context.previousState
        );
      }
      toast({
        variant: "destructive",
        description: "Failed to update bookmark status. Please try again.",
      });
    },
  });

  return (
    <button className="flex items-center gap-2" onClick={() => mutate()}>
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary"
        )}
      />
    </button>
  );
};
