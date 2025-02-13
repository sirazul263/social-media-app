"use client";
import { LikeInfo } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { useLikeInfo } from "../hooks/use-like-info";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export const LikeButton = ({ postId, initialState }: LikeButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data } = useLikeInfo(postId, initialState);

  const { mutate } = useMutation({
    mutationFn: async () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),
    onMutate: async () => {
      const queryKey: QueryKey = ["like-info", postId];

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
      }));

      return { previousState };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousState) {
        queryClient.setQueryData<LikeInfo>(
          ["like-info", postId],
          context.previousState
        );
      }
      toast({
        variant: "destructive",
        description: "Failed to update like status. Please try again.",
      });
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["like-info", postId] });
    // },
  });

  return (
    <button className="flex items-center gap-2" onClick={() => mutate()}>
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500 "
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
};
