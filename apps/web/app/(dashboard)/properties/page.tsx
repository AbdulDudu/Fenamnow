import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { QueryClient } from "@tanstack/react-query";
import useSupabaseServer from "@web/lib/helpers/supabase/server-client";
import {
  getAmenities,
  getLeaseDurations,
  getProperties,
  getPropertyTypes
} from "@web/lib/queries/properties";
import PropertiesListScreen from "@web/modules/dashboard/properties/screens/list";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Properties | Fenamnow"
};
export default async function PropertiesPage({
  params,
  searchParams
}: {
  params: { id: number };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const queryClient = new QueryClient();
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);

  const {
    data: { session }
  } = await supabase.auth.getSession();

  await prefetchQuery(
    queryClient,
    getProperties({ client: supabase, session })
  );
  await prefetchQuery(queryClient, getPropertyTypes({ client: supabase }));
  await prefetchQuery(queryClient, getLeaseDurations({ client: supabase }));
  await prefetchQuery(queryClient, getAmenities({ client: supabase }));

  const page = parseInt(searchParams?.page as string) || 1;

  return <PropertiesListScreen page={page} />;
}
