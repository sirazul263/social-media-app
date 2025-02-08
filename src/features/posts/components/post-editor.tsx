"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { createPost } from "../actions/create-post-actions";
import { UserAvatar } from "@/components/user-avatar";
import { useSession } from "@/hooks/session-provider";
import { Button } from "@/components/ui/button";
import { useCreatePost } from "../mutations/use-create-post";
import { LoadingButton } from "@/components/loading-button";

export const PostEditor = () => {
  const { user } = useSession();
  const mutation = useCreatePost();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's crack-a-lackin'?",
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const onSubmit = () => {
    mutation.mutate(input, {
      onSuccess: (data) => {
        editor?.commands.clearContent();
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="w-full max-h-[20rem] overflow-y-auto bg-background rounded-2xl py-3 px-5 "
        />
      </div>
      <div className="flex justify-end">
        <LoadingButton
          loading={mutation.isPending}
          className="min-w-20"
          onClick={onSubmit}
          disabled={!input.trim()}
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
};
