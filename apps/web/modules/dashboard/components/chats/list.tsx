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
import { useSession } from "@web/modules/common/shared/providers/session";
import { ClassValue } from "class-variance-authority/types";
import { ChannelFilters, ChannelSort } from "stream-chat";
import { ChannelList } from "stream-chat-react";

export default function ChatsList({ className }: { className?: ClassValue }) {
  const { session } = useSession();

  const sort: ChannelSort = { last_message_at: -1 };
  const filters: ChannelFilters = {
    type: "messaging",
    members: { $in: [session?.user.id] }
  };
  return (
    <div className={cn("flex h-full w-1/3 flex-col justify-start", className)}>
      <ChannelList sort={sort} filters={filters} showChannelSearch />
    </div>
  );
}
