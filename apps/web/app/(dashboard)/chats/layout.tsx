import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { QueryClient } from "@tanstack/react-query";
import useSupabaseServer from "@web/lib/helpers/supabase/server-client";
import { getChats } from "@web/lib/queries/chats";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);

  const {
    data: { session }
  } = await supabase.auth.getSession();

  await prefetchQuery(
    queryClient,
    getChats({ client: supabase, user: session?.user! })
  );

  return <>{children}</>;
}
