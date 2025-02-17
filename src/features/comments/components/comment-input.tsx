import { PostData } from "@/lib/types";
import { useState } from "react";
import { useCreateComment } from "../mutations/use-create-comment";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, SendHorizonal } from "lucide-react";

interface CommentInputProps {
  post: PostData;
}

export const CommentInput = ({ post }: CommentInputProps) => {
  const [input, setInput] = useState("");
  const mutation = useCreateComment(post.id);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) {
      return;
    }
    mutation.mutate(
      { post, content: input },
      {
        onSuccess: () => {
          setInput("");
        },
      }
    );
  };

  return (
    <form
      className="flex w-full items-center gap-2 mb-2"
      onSubmit={handleSubmit}
    >
      <Input
        placeholder="Write a comment..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!input.trim || mutation.isPending}
      >
        {!mutation.isPending ? (
          <SendHorizonal />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
    </form>
  );
};
