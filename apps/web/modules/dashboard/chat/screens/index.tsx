"use client";

import { Separator } from "@fenamnow/ui/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getStreamChatClient } from "@web/lib/helpers/chat";
import { createChatToken } from "@web/lib/queries/chats";
import { useSession } from "@web/modules/common/shared/providers/session";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import ChatsList from "./list";
import ChatRoom from "./room";

export default function ChatsScreen() {
  const { session } = useSession();
  const [loading, setLoading] = useState(true);

  const { data } = useQuery({
    queryKey: [session],
    queryFn: async () =>
      await createChatToken(session.user.id)
        .then(
          async res =>
            await getStreamChatClient.connectUser(
              { id: session.user.id },
              res.token
            )
        )
        .finally(() => setLoading(false)),
    enabled: !!session
  });

  if (!session) return null;

  if (loading) {
    return (
      <div className="flex size-full flex-col items-center justify-center pt-2">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }
  return (
    <div className="flex size-full h-[90vh] flex-col justify-between pt-2">
      <div className="relative flex h-full items-start">
        <ChatsList className="hidden sm:flex" />
        <Separator orientation="vertical" className="ml-4 hidden sm:flex" />
        <ChatRoom className=" w-full sm:w-2/3" />
      </div>
    </div>
  );
}
