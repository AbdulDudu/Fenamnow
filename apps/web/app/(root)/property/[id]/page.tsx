import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from "@tanstack/react-query";
import useSupabaseServer, {
  createClient
} from "@web/lib/helpers/supabase/server-client";
import { getPropertyById } from "@web/lib/queries/properties";
import { isValidUrl } from "@web/lib/utils/is-valid-url";
import PropertyDetailsScreen from "@web/modules/property/screens/details";
import { Metadata, ResolvingMetadata } from "next";
import { cookies } from "next/headers";

type PropertyPageProps = {
  params: { id: number };
};
export async function generateMetadata(
  { params }: PropertyPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;
  // const
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const property = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  const imageURL = isValidUrl(
    property.data.images[0].uri || property.data.images[0]
  )
    ? property.data.images[0]
    : supabase.storage
        .from("properties")
        .getPublicUrl(property.data.images[0].uri).data.publicUrl;

  return {
    title: `${property.data.community}, ${property.data.address} | Fenamnow`,
    openGraph: {
      type: "website",
      title: `${property.data.community}, ${property.data.address} | Fenamnow`,
      description: property.data.description,
      siteName: "Fenamnow",
      images: [
        {
          url: imageURL
        }
      ]
    }
  };
}
export default async function PropertiesDetailsPage({
  params
}: PropertyPageProps) {
  const cookieStore = cookies();
  const supabase = useSupabaseServer(cookieStore);
  const queryClient = new QueryClient();

  const {
    data: { session }
  } = await supabase.auth.getSession();

  await prefetchQuery(
    queryClient,
    getPropertyById({ client: supabase, id: params.id })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PropertyDetailsScreen id={params.id} />
    </HydrationBoundary>
  );
}
