import { Linkify } from "@/components/linkify";
import { UserAvatar } from "@/components/user-avatar";
import { FollowButton } from "@/features/followers/components/follow-button";
import { UserTooltip } from "@/features/users/components/user-tooltip";
import { validateRequest } from "@/lib/auth";
import { UserData } from "@/lib/types";
import Link from "next/link";

interface UserInfoSidebarProps {
  user: UserData;
}

export const UserInfoSidebar = async ({ user }: UserInfoSidebarProps) => {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) {
    return null;
  }
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold ">About this user</div>
      <UserTooltip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-3"
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div>
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id
            ),
          }}
        />
      )}
    </div>
  );
};
