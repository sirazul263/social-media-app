import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { useRef } from "react";

interface AttachmentButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

export const AttachmentButton = ({
  onFilesSelected,
  disabled,
}: AttachmentButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="hover:text-primary  text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/* , video/*"
        multiple
        ref={fileInputRef}
        className="hidden sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
};
