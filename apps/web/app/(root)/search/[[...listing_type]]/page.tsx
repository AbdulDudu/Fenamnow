import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from "@tanstack/react-query";
import useSupabaseServer from "@web/lib/helpers/supabase/server-client";
import {
  getLeaseDurations,
  getProperties,
  getPropertyTypes
} from "@web/lib/queries/properties";
import SearchScreen, { SearchScreenProps } from "@web/modules/search/screens";
import { capitalize } from "lodash";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata({
  params
}: SearchScreenProps): Promise<Metadata> {
  const listing_type = params.listing_type;

  return {
    openGraph: {
      type: "website",
      url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      title: `Find ${capitalize(listing_type)}s | Fenamnow`,
      description: "Easy search, easy find with fenamnow",
      siteName: "Fenamnow",
      images: [
        {
          url: "/og-image.png"
        }
      ]
    }
  };
}
export default async function SearchPage({
  params,
  searchParams
}: SearchScreenProps) {
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);
  const queryClient = new QueryClient();

  const {
    data: { session }
  } = await supabase.auth.getSession();

  const listing_type = params.listing_type;
  await prefetchQuery(
    queryClient,
    getProperties({ client: supabase, listing_type, session, ...searchParams })
  );

  await prefetchQuery(queryClient, getLeaseDurations({ client: supabase }));
  await prefetchQuery(queryClient, getPropertyTypes({ client: supabase }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchScreen params={params} searchParams={searchParams} />
    </HydrationBoundary>
  );
}
