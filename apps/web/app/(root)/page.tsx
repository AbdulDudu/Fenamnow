import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from "@tanstack/react-query";
import useSupabaseServer from "@web/lib/helpers/supabase/server-client";
import { getProperties, getPropertyTypes } from "@web/lib/queries/properties";
import HomeScreen from "@web/modules/home/screens";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);
  const queryClient = new QueryClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  await prefetchQuery(
    queryClient,
    getProperties({
      client: supabase,
      session,
      listing_type: "rental",
      start: 0,
      end: 7
    })
  );
  await prefetchQuery(
    queryClient,
    getProperties({
      client: supabase,
      session,
      listing_type: "sale",
      start: 0,
      end: 7
    })
  );
  await prefetchQuery(
    queryClient,
    getProperties({
      client: supabase,
      session,
      listing_type: "lease",
      start: 0,
      end: 7
    })
  );

  await prefetchQuery(queryClient, getPropertyTypes({ client: supabase }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeScreen />
    </HydrationBoundary>
  );
}
