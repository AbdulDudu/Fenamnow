import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from "@tanstack/react-query";
import useSupabaseServer from "@web/lib/helpers/supabase/server-client";
import { getMessages, getOtherChatReciever } from "@web/lib/queries/chats";
import ChatsScreen from "@web/modules/dashboard/screens/chats";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Chats | Fenamnow"
};
export default async function ChatPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);
  const queryClient = new QueryClient();

  const {
    data: { session }
  } = await supabase.auth.getSession();

  await prefetchQuery(
    queryClient,
    getOtherChatReciever({
      client: supabase,
      user: session?.user!,
      chat_id: params.id
    })
  );

  await prefetchQuery(
    queryClient,
    getMessages({ client: supabase, chat_id: params.id })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatsScreen id={params.id} />
    </HydrationBoundary>
  );
}
