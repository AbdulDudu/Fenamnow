import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@fenamnow/ui/components/ui/avatar";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@ui/lib/utils";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { useClientPublicUrls } from "@web/lib/hooks/use-client-public-url";
import {
  getLastMessage,
  getOtherChatReciever,
  setMessagesToSeen
} from "@web/lib/queries/chats";
import { useSession } from "@web/modules/common/shared/providers/session";
import { intlFormatDistance } from "date-fns";
import { useRouter } from "next/navigation";

export default function ChatListItem({
  id,
  isSelected
}: {
  id: string;
  isSelected?: boolean;
}) {
  const { session } = useSession();
  const supabase = useSupabaseBrowser();
  const router = useRouter();

  const { data: chat } = useQuery(
    getOtherChatReciever({
      client: supabase,
      user: session?.user!,
      chat_id: id
    })
  );

  const { data: lastMessage } = useQuery(
    getLastMessage({
      client: supabase,
      chat_id: id
    })
  );

  const { mutateAsync: update } = useMutation({
    mutationKey: ["update message"],
    mutationFn: setMessagesToSeen,
    onSuccess: () => {
      router.push(`/chats/${chat?.chat_id}`);
    }
  });

  // @ts-ignore
  const publicUrl = useClientPublicUrls(chat?.user_id?.avatar_url, "avatars");

  return (
    <div
      onClick={async () => {
        await update({
          client: supabase,
          chat_id: chat?.chat_id!,
          user: session?.user!
        });
      }}
      className={cn(
        "hover:bg-accent flex h-20 w-full justify-between space-x-2 rounded-md border p-2 duration-150",
        isSelected && "bg-accent"
      )}
    >
      <div className="size-16">
        <Avatar className="size-full">
          <AvatarImage
            src={publicUrl}
            //   @ts-ignore
            alt={chat?.user_id?.full_name}
          />
          <AvatarFallback>
            {/* @ts-ignore */}
            {chat?.user_id?.full_name?.split(" ").map((n: string) => n[0])}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="spcae-y-2 flex h-full w-3/5 flex-col items-start">
        {/* @ts-ignore */}
        <p className="font-semibold">{chat?.user_id.full_name}</p>
        <p
          className={cn(
            "text-foreground/70 truncate text-sm",
            !lastMessage?.seen && "font-bold"
          )}
        >
          {lastMessage?.sender_id == session?.user?.id && "You: "}
          {lastMessage &&
          lastMessage?.content?.trim()?.length > 0 &&
          lastMessage?.content_type !== "text"
            ? "Sent an attachment"
            : lastMessage?.content}
        </p>
      </div>
      <div className="flex h-full w-1/5 flex-col space-y-4">
        <p className="text-foreground/70 text-xs">
          {lastMessage?.created_at &&
            intlFormatDistance(
              new Date(lastMessage?.created_at as string),
              new Date(),
              {}
            )}
        </p>
        {lastMessage?.sender_id !== session?.user?.id && (
          <span
            className={cn(
              "bg-primary flex size-2 rounded-full",
              lastMessage?.seen && "invisible"
            )}
          />
        )}
      </div>
    </div>
  );
}
