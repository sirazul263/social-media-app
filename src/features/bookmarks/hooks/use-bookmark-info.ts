import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export const useBookmarkInfo = (postId: string, initialState: BookmarkInfo) => {
  const query = useQuery({
    queryKey: ["bookmark-info", postId],
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmarks`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity, // 1 hour
  });

  return query;
};
