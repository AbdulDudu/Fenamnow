import { Button } from "@fenamnow/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@fenamnow/ui/components/ui/dropdown-menu";
import { PlusCircle } from "lucide-react";
import { useRef } from "react";
import { useMessageInputContext } from "stream-chat-react";

export default function AttachmentButton() {
  const { uploadNewFiles, isUploadEnabled, maxFilesLeft } =
    useMessageInputContext();
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: any) {
    const files = e.currentTarget.files;

    if (files && files.length > 0) {
      uploadNewFiles(files);
      e.currentTarget.value = "";
    }
  }

  if (!isUploadEnabled || maxFilesLeft === 0) {
    return null;
  }

  return (
    <>
      <input
        ref={mediaInputRef}
        type="file"
        className="hidden"
        accept="image/*,video/*"
        onChange={handleChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z,.tar,.gz,.bz2,.tgz,.tbz2,.tar.gz,.tar.bz2,.tar.xz,.tar.zst,.tar.lz,.tar.lz4,.tar.sz,.tar.zstd,.tar.lzma,.tar.lzo,.tar.lzop"
        onChange={handleChange}
      />
      {/* Dropdown menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" size="icon">
            <PlusCircle />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => mediaInputRef.current?.click()}>
            Photos and Videos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            Files
          </DropdownMenuItem>
          <DropdownMenuItem>Location</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
