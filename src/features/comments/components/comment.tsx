import { UserAvatar } from "@/components/user-avatar";
import { UserTooltip } from "@/features/users/components/user-tooltip";
import { useSession } from "@/hooks/session-provider";
import { CommentData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import { CommentMoreButton } from "./comment-more-button";

interface CommentProps {
  comment: CommentData;
}

export const Comment = ({ comment }: CommentProps) => {
  const { user } = useSession();

  return (
    <div className="flex gap-3 py-3 group/comment">
      <span className="hidden sm:inline">
        <UserTooltip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
          </Link>
        </UserTooltip>
      </span>
      <div>
        <div className="flex items-center text-sm gap-1">
          <UserTooltip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-medium hover:underline"
            >
              {comment.user.displayName}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground text-xs">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
      {comment.user.id === user.id && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
};
