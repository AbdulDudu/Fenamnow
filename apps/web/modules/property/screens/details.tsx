"use client";

import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import useSupabaseBrowser from "@web/lib/helpers/supabase/browser-client";
import { getProfileById } from "@web/lib/queries/profiles";
import { getPropertyById } from "@web/lib/queries/properties";
import { useSession } from "@web/modules/common/shared/providers/session";
import PropertyAddressHeader from "../components/address-header";
import PropertyDescription from "../components/description";
import PropertyImages from "../components/images";
import PropertyPoster from "../components/poster";

export default function PropertyDetailsScreen({ id }: { id: number }) {
  const supabase = useSupabaseBrowser();
  const { session } = useSession();

  const { data: property } = useQuery(
    getPropertyById({ client: supabase, id })
  );

  const { data: profile } = useQuery(
    getProfileById({ client: supabase, id: property?.user_id! })
  );

  return (
    <div className="container flex min-h-screen w-full flex-col space-y-8">
      {/* Address, price, Action buttons and property type  */}
      {property && <PropertyAddressHeader property={property} />}
      {/* Images */}
      <PropertyImages property={property} />
      <PropertyPoster
        {...profile}
        is_owner={session?.user.id == property?.user_id}
        video_tour={property?.video_tour}
        className="flex w-full flex-col lg:hidden"
      />

      <div className="flex w-full flex-1 justify-between space-x-6">
        <PropertyDescription {...property} />
        <PropertyPoster
          {...profile}
          is_owner={session?.user.id == property?.user_id}
          video_tour={property?.video_tour}
          className="hidden  flex-col lg:flex"
        />
      </div>
    </div>
  );
}
