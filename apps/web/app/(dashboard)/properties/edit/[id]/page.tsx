import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from "@tanstack/react-query";
import useSupabaseServer from "@web/lib/helpers/supabase/server-client";
import { getPropertyById } from "@web/lib/queries/properties";
import PropertyEditScreen from "@web/modules/dashboard/screens/properties/edit";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Edit Property | Fenamnow"
};
export default async function PropertiesEditPage({
  params
}: {
  params: { id: number };
}) {
  const queryClient = new QueryClient();
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);

  await prefetchQuery(
    queryClient,
    getPropertyById({ client: supabase, id: params.id })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PropertyEditScreen id={params.id} />
    </HydrationBoundary>
  );
}
