import kyInstance from "@/lib/ky";
import { LikeInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export const useLikeInfo = (postId: string, initialState: LikeInfo) => {
  const query = useQuery({
    queryKey: ["like-info", postId],
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity, // 1 hour
  });

  return query;
};
