"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { UserAvatar } from "@/components/user-avatar";
import { useSession } from "@/hooks/session-provider";
import { useCreatePost } from "../mutations/use-create-post";
import { LoadingButton } from "@/components/loading-button";
import { useMediaUpload } from "../hooks/use-media-upload";
import { AttachmentButton } from "./attachment-button";
import { AttachmentPreviews } from "./attachment-previews";
import { Loader2 } from "lucide-react";
import { useDropzone } from "@uploadthing/react";
import { cn } from "@/lib/utils";
import { ClipboardEvent } from "react";

export const PostEditor = () => {
  const { user } = useSession();
  const mutation = useCreatePost();

  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  const { onClick, ...rootProps } = getRootProps();

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
    mutation.mutate(
      {
        content: input,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUploads();
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };
  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const files = Array.from(e.clipboardData.items)
      .filter((file) => file.kind === "file")
      .map((item) => item.getAsFile()) as File[];
    startUpload(files);
  };
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <div {...rootProps} className="w-full">
          <EditorContent
            editor={editor}
            className={cn(
              "w-full max-h-[20rem] overflow-y-auto bg-background rounded-2xl py-3 px-5 ",
              isDragActive && "outline-dashed"
            )}
            onPaste={onPaste}
          />
          <input {...getInputProps()} />
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="flex justify-end gap-3 items-center">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <AttachmentButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length > 5}
        />
        <LoadingButton
          loading={mutation.isPending}
          className="min-w-20"
          onClick={onSubmit}
          disabled={!input.trim() || isUploading}
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
};
