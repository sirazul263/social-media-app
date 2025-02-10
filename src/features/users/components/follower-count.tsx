"use client";

import { useFollowerInfo } from "@/features/followers/hooks/use-follower-info";
import { FollowerInfo } from "@/lib/types";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}
export const FollowerCount = ({ userId, initialState }: FollowerCountProps) => {
  const { data } = useFollowerInfo(userId, initialState);
  return (
    <span>
      Followers <span className="font-semibold">{data.followers}</span>
    </span>
  );
};
