import Link from "next/link";
import { Button } from "./ui/button";
import { Bookmark, Home, Mail } from "lucide-react";
import { NotificationsButton } from "@/features/notifications/components/notifications-button";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MessagesButton } from "@/features/messages/components/messages-button";
import streamServerClient from "@/lib/stream";

interface MenubarProps {
  className?: string;
}

export const Menubar = async ({ className }: MenubarProps) => {
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipient: { id: user.id },
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />

      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />

      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
};
