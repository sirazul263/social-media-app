import { Chat } from "@/features/messages/components/chat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
};

export default function MessagesPage() {
  return <Chat />;
}
