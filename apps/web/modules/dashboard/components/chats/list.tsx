"use client";

import { ScrollArea } from "@fenamnow/ui/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@fenamnow/ui/components/ui/tabs";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { cn } from "@ui/lib/utils";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { getChats } from "@web/lib/queries/chats";
import { useSession } from "@web/modules/common/shared/providers/session";
import { ClassValue } from "class-variance-authority/types";
import ChatListItem from "./chat-list-item";

export default function ChatsList({
  id,
  className
}: {
  id: string;
  className?: ClassValue;
}) {
  const supabase = useSupabaseBrowser();
  const { session } = useSession();
  const { data } = useQuery(
    getChats({ client: supabase, user: session?.user! })
  );

  return (
    <div className={cn("flex h-full w-1/3 flex-col justify-start", className)}>
      <Tabs defaultValue="conversations" className="size-full max-h-full">
        <TabsList className="w-full">
          <TabsTrigger value="conversations" className="flex-1">
            Conversations
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex-1">
            Requests
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="conversations"
          className={cn(
            "flex size-full max-h-[85vh] flex-col items-center",
            data?.length == 0 && "justify-center"
          )}
        >
          {data?.length == 0 && (
            <p className="text-lg">You have no conversations so far</p>
          )}
          {data?.length !== undefined && data?.length > 0 && (
            <ScrollArea className="size-full max-h-full">
              <div className="flex flex-col gap-y-2">
                {data.map(chat => (
                  <ChatListItem
                    key={chat.id}
                    id={chat.chat_id}
                    isSelected={chat.chat_id == id}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
        <TabsContent
          value="requests"
          className="flex size-full max-h-[90%] flex-col items-center justify-center"
        >
          <p className="text-lg">You have no requests so far</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
