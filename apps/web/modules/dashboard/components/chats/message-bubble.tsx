import { Database } from "@fenamnow/types/database";
import { Button } from "@fenamnow/ui/components/ui/button";
import { Progress } from "@fenamnow/ui/components/ui/progress";
import { cn } from "@ui/lib/utils";
import { useClientPublicUrls } from "@web/lib/hooks/use-client-public-url";
import { formatFileSize } from "@web/lib/utils/format-fIle-size";
import { useSession } from "@web/modules/common/shared/providers/session";
import { PublicImage } from "@web/modules/property/components/images";
import axios from "axios";
import { intlFormatDistance } from "date-fns";
import { truncate } from "lodash";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = Partial<Database["public"]["Tables"]["messages"]["Row"]>;

const VideoMessage = ({ path }: { path: string }) => {
  const publicUrl = useClientPublicUrls(path);
  return <video className="size-full rounded-sm" src={publicUrl as string} />;
};

const FileMessage = ({ path }: { path: string }) => {
  const publicUrl = useClientPublicUrls(path);

  const fileName = truncate(decodeURI(path.split("/").pop() as string), {
    length: 26
  });
  const fileExt = fileName?.split(".").pop();

  const [fileSize, setFileSize] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    const fetchFileSize = async () => {
      if (!publicUrl) return;
      const res = await fetch(publicUrl);
      if (!res.ok) return;
      const blob = await res.blob();
      setFileSize(`${formatFileSize(blob.size)}B`);
    };

    fetchFileSize();
  }, [publicUrl]);

  const handleDowload = async () => {
    const promise = axios
      .get("file-download-url", {
        responseType: "blob",
        onDownloadProgress: progressEvent => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          setDownloadProgress(percentage);
        }
      })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName as string);
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => error);

    toast.promise(promise, {
      loading: (
        <div>
          <p>Downloading {fileName}</p>
          <Progress value={downloadProgress} />
        </div>
      ),
      success: `Downloaded ${fileName} successfully`,
      error: `Failed to download ${fileName}`
    });
  };

  return (
    <div className="bg-accent flex w-[200px] flex-col">
      <div className="flex h-[200px] min-w-full items-center justify-center">
        <p className="text-center font-bold uppercase">{fileExt}</p>
      </div>
      <div className="flex h-[80px] w-full items-start justify-between bg-neutral-300 p-2 dark:bg-neutral-600">
        <p className="font-bold">
          {fileName}
          <br />
          {fileSize && <span className="text-xs opacity-50">{fileSize}</span>}
        </p>
        <Button asChild size="icon" variant="ghost" onClick={handleDowload}>
          <Download />
        </Button>
      </div>
    </div>
  );
};
export default function MessageBubble(message: Props) {
  const { session } = useSession();

  const renderContent = () => {
    switch (message.content_type) {
      case "text":
        return <div>{message.content}</div>;
      case "image":
        return (
          <PublicImage
            priority
            className="size-full rounded-sm"
            path={message.content as string}
            width={200}
            height={400}
            alt=""
          />
        );
      case "video":
        return <VideoMessage path={message.content as string} />;
      case "audio":
        return <audio src={message.content} />;
      case "file":
        return <FileMessage path={message.content as string} />;
      default:
        return <div>{message.content}</div>;
    }
  };
  return (
    <div
      key={message.id}
      className={cn(
        "bg-accent flex min-w-[10%] max-w-[70%] flex-col space-y-2 self-start rounded-lg p-4",
        message.sender_id === session?.user?.id && "bg-primary self-end"
      )}
    >
      {renderContent()}
      <div
        className={cn(
          "flex justify-start",
          message.sender_id === session?.user?.id && "justify-end"
        )}
      >
        <p className="text-foreground/70 text-sm font-bold">
          {message.seen
            ? intlFormatDistance(
                new Date(message.seen as string),
                new Date(),
                {}
              )
            : "Sent"}
        </p>
      </div>
    </div>
  );
}
