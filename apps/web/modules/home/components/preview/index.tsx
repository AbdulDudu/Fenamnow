"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@fenamnow/ui/components/ui/tabs";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { getProperties } from "@web/lib/queries/properties";
import { useSession } from "@web/modules/common/shared/providers/session";
import { Loader2 } from "lucide-react";
import ListingPreview from "./listing-preview";

export default function PropertiesPreview() {
  const supabase = useSupabaseBrowser();
  const { session } = useSession();

  const { data: rentals, isPending: rentalPending } = useQuery(
    getProperties({
      client: supabase,
      session,
      listing_type: "rental",
      start: 0,
      end: 7
    })
  );

  const { data: sales, isPending: salesPending } = useQuery(
    getProperties({
      client: supabase,
      session,
      listing_type: "sale",
      start: 0,
      end: 7
    })
  );

  const { data: leases, isPending: leasesPending } = useQuery(
    getProperties({
      client: supabase,
      session,
      listing_type: "lease",
      start: 0,
      end: 7
    })
  );

  return (
    <section className="container w-full">
      <h3 className="text-center">Browse through some of our properties</h3>
      <Tabs defaultValue="rent" className="size-full">
        <TabsList>
          <TabsTrigger value="rent">Rent</TabsTrigger>
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="lease">Lease</TabsTrigger>
        </TabsList>

        <TabsContent value="rent">
          {rentalPending ? (
            <Loader2 />
          ) : (
            <ListingPreview properties={rentals || []} />
          )}
        </TabsContent>
        <TabsContent value="buy">
          {salesPending ? (
            <Loader2 />
          ) : (
            <ListingPreview properties={sales || []} />
          )}
        </TabsContent>
        <TabsContent value="lease">
          {leasesPending ? (
            <Loader2 />
          ) : (
            <ListingPreview properties={leases || []} />
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
