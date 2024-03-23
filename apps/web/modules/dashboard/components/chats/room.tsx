"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@fenamnow/ui/components/ui/avatar";
import { Button } from "@fenamnow/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@fenamnow/ui/components/ui/dropdown-menu";
import { ScrollArea } from "@fenamnow/ui/components/ui/scroll-area";
import { Textarea } from "@fenamnow/ui/components/ui/textarea";
import {
  useInsertMutation,
  useQuery,
  useSubscription,
  useSubscriptionQuery
} from "@supabase-cache-helpers/postgrest-react-query";
import { cn } from "@ui/lib/utils";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { useClientPublicUrls } from "@web/lib/hooks/use-client-public-url";
import { getMessages, getOtherChatReciever } from "@web/lib/queries/chats";
import { useSession } from "@web/modules/common/shared/providers/session";
import { ClassValue } from "class-variance-authority/types";
import { intlFormatDistance } from "date-fns";
import { truncate } from "lodash";
import {
  File,
  GalleryHorizontal,
  Info,
  Plus,
  Send,
  ShieldBan,
  Video
} from "lucide-react";
import {
  ElementRef,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { useDropzone } from "react-dropzone";
import { FaImages } from "react-icons/fa";
import { FcPicture } from "react-icons/fc";
import { toast } from "sonner";
import ChatActions from "./actions";
import MessageBubble from "./message-bubble";

export default function ChatRoom({
  id,
  className
}: {
  id: string;
  className?: ClassValue;
}) {
  const { session } = useSession();
  const supabase = useSupabaseBrowser();
  const [newMessage, setNewMessage] = useState("");
  const [subscribed, setSubscribed] = useState<Record<string, unknown>>({});

  const messageListRef = useRef<HTMLDivElement>(null);

  const { data: chat } = useQuery(
    getOtherChatReciever({
      client: supabase,
      user: session?.user!,
      chat_id: id
    })
  );

  // @ts-ignore
  const publicUrl = useClientPublicUrls(chat?.user_id.avatar_url, "avatars");
  const { data: messages } = useQuery(
    getMessages({ client: supabase, chat_id: id })
  );

  const { channel } = useSubscriptionQuery(
    supabase,
    `chat-${id}-channel`,
    {
      event: "*",
      table: "messages",
      schema: "public"
    },
    ["id, sender_id, content, content_type, created_at, seen"],
    null
  );

  channel?.on("presence", { event: "sync" }, () => {
    const newState = channel.presenceState();
    setSubscribed(newState);
  });

  const { mutateAsync: sendNotification } = useInsertMutation(
    supabase.from("notifications"),
    ["user_id", "title", "body", "image", "url"],
    null,
    {
      onError: error => {
        toast.error("Failed to send notification");
      }
    }
  );
  const { mutateAsync: insert } = useInsertMutation(
    supabase.from("messages"),
    ["chat_id", "content", "content_type", "sender_id", "is_edited"],
    null,
    {
      onSuccess: async (_, variables) => {
        setNewMessage("");
        if (Object.keys(subscribed).length == 0)
          await sendNotification({
            // @ts-ignore
            user_id: chat?.user_id?.id,
            sender_id: session?.user?.id,
            title: session?.user?.user_metadata.full_name,
            // @ts-ignore
            body: truncate(variables.content, { length: 100 }),
            image: publicUrl || "",
            url: `/chats/${id}`
          });
      },
      disableAutoQuery: true,
      onError: () => {
        toast.error("Failed to send message");
      }
    }
  );

  const uploadFile = useCallback(
    async (file: File) => {
      const fileType = file.type.split("/")[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${id}/${fileType}s/${file.name.split(".")[0]}.${fileExt}`;

      const { data: fileData, error: uploadError } = await supabase.storage
        .from("chat")
        .upload(filePath, file);
      if (uploadError) {
        throw uploadError;
      }

      return fileData.path;
    },
    [id, supabase.storage]
  );
  const handleKeyDown = (event: any) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      newMessage.trim().length > 0
    ) {
      (async () => {
        await insert([
          {
            chat_id: id[0],
            content: newMessage.trim(),
            content_type: "text",
            sender_id: session?.user?.id,
            is_edited: false
          }
        ]);
      })();
    }
  };

  const onImagesDrop = useCallback(
    (acceptedFiles: File[]) => {
      const filesUpload = Promise.all(
        acceptedFiles.map((file: File) => {
          uploadFile(file).then(
            async path =>
              await insert([
                {
                  chat_id: id[0],
                  content: `chat/${path}`,
                  content_type: "image",
                  sender_id: session?.user?.id,
                  is_edited: false
                }
              ])
          );
        })
      );

      toast.promise(filesUpload, {
        loading: "Uploading images",
        success: "Images uploaded successfully",
        error: "Failed to upload images"
      });
    },
    [id, insert, session?.user?.id, uploadFile]
  );

  const onVideosDrop = useCallback(
    (acceptedFiles: File[]) => {
      const videosUpload = Promise.all(
        acceptedFiles.map((file: File) => {
          uploadFile(file).then(
            async path =>
              await insert([
                {
                  chat_id: id[0],
                  content: `chat/${path}`,
                  content_type: "image",
                  sender_id: session?.user?.id,
                  is_edited: false
                }
              ])
          );
        })
      );

      toast.promise(videosUpload, {
        loading: "Uploading Videos",
        success: "Videos uploaded successfully",
        error: "Failed to upload videos"
      });
    },
    [id, insert, session?.user?.id, uploadFile]
  );

  const onFilesDrop = useCallback(
    (acceptedFiles: File[]) => {
      const videosUpload = Promise.all(
        acceptedFiles.map((file: File) => {
          uploadFile(file).then(
            async path =>
              await insert([
                {
                  chat_id: id[0],
                  content: `chat/${path}`,
                  content_type: "file",
                  sender_id: session?.user?.id,
                  is_edited: false
                }
              ])
          );
        })
      );

      toast.promise(videosUpload, {
        loading: "Uploading Files",
        success: "Files uploaded successfully",
        error: "Failed to upload Files"
      });
    },
    [id, insert, session?.user?.id, uploadFile]
  );

  const { open: openImage } = useDropzone({
    onDrop: onImagesDrop,
    accept: {
      "image/jpeg": [],
      "image/png": []
    }
  });

  const { open: openVideo } = useDropzone({
    onDrop: onVideosDrop,
    accept: {
      "video/*": []
    }
  });

  const { open: openFiles } = useDropzone({
    onDrop: onFilesDrop
  });

  useEffect(() => {
    if (messageListRef.current)
      messageListRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
  }, [messages]);

  if (!id)
    return <div className="flex h-full w-2/3 items-center justify-center" />;

  return (
    <div className={cn("h-full w-2/3", className)}>
      <div className="bg-accent container flex h-14 w-full items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar>
            {/* @ts-ignore */}
            <AvatarImage src={publicUrl} alt={chat?.user_id.full_name} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {/* @ts-ignore */}
          <p className="text-lg font-bold">{chat?.user_id.full_name}</p>
        </div>

        <ChatActions />
      </div>
      <div className="flex size-full h-[75vh] flex-col items-center pt-6">
        <ScrollArea className="size-full max-h-full">
          <div
            className="flex h-full flex-col gap-2 md:container sm:gap-6"
            ref={messageListRef}
          >
            {messages?.map(message => (
              <MessageBubble key={message.id} {...message} />
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="flex h-20 w-full items-center justify-between sm:container sm:space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button size="icon" variant="ghost">
              <Plus />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px] space-y-2">
            <DropdownMenuItem onClick={openImage}>
              <GalleryHorizontal className="mr-2" />
              <p className="text-lg font-semibold">Photo</p>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openVideo}>
              <Video className="mr-2" />
              <p className="text-lg font-semibold">Video</p>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openFiles}>
              <File className="mr-2" />
              <p className="text-lg font-semibold">File</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Textarea
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your message"
          className="h-6 resize-none sm:h-12"
        />
        <Button
          size="icon"
          className="px-1"
          variant="ghost"
          onClick={async () => {
            await insert([
              {
                chat_id: id[0],
                content: newMessage.trim(),
                content_type: "text",
                sender_id: session?.user?.id,
                is_edited: false
              }
            ]);
          }}
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
}
