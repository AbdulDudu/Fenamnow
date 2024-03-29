import { Database } from "@fenamnow/types/database";
import { Session } from "@supabase/supabase-js";
import { TypedSupabaseClient } from "../helpers/supabase/supabase";

export type Property = Database["public"]["Tables"]["properties"]["Row"];

export function getProperties({
  client,
  session = null,
  start = 0,
  end = 5,
  listing_type,
  isAdmin = false,
  bedrooms,
  bathrooms,
  // created_at,
  city,
  community,
  price_range,
  property_types,
  lease_durations,
  // map_address,
  // date_available,
  furnished,
  negotiable
  // status,
}: {
  client: TypedSupabaseClient;
  session?: Session | null | undefined;
  start?: number;
  end?: number;
  isAdmin?: boolean;
  bedrooms?: number | undefined;
  bathrooms?: number | undefined;
  created_at?: string;
  city?: string;
  community?: string;
  price_range?: number[];
  property_types?: Property["property_type"][];
  listing_type?: Property["listing_type"];
  lease_durations?: Property["lease_duration"][];
  map_address?: string;
  date_available?: string;
  furnished?: boolean | null;
  negotiable?: boolean;
  status?: Property["status"];
}) {
  // Create the initial query
  let query = client
    .from("properties")
    .select("*, video_tour(*)", { count: "estimated" });
  // If session is provided, filter by user_id
  if (session) {
    if (isAdmin) {
      query = query.eq("user_id", session.user.id);
    } else {
      query = query
        .neq("user_id", session.user.id)
        .range(start, end)
        .eq("status", "available");
    }
  }
  if (!session) {
    query = query.range(start, end).eq("status", "available");
  }

  // If listingType is provided, filter by listing_type
  listing_type && (query = query.eq("listing_type", listing_type));

  property_types &&
    property_types.length > 0 &&
    (query = query.in("property_type", property_types));

  lease_durations &&
    lease_durations.length > 0 &&
    (query = query.in("lease_duration", lease_durations));

  negotiable && (query = query.eq("negotiable", negotiable!));
  furnished && (query = query.eq("furnished", furnished!));

  city && (query = query.eq("city", city!));
  community && (query = query.eq("community", community!));

  // price_range &&
  //   (query = query.gte("price", price_range![0]).lte("price", price_range![1]));

  bedrooms && bedrooms > 0 && (query = query.eq("bedrooms", bedrooms));
  bathrooms && bathrooms > 0 && (query = query.eq("bathrooms", bathrooms));

  // Fetch the data, error, and count using the query and provided range

  // Determine if there is a next page based on the data length and the total count

  // Return the retrieved data along with the error, count, and hasNextPage
  return query.order("created_at", { ascending: false }).range(start, end);
}

export function getPropertyById({
  client,
  id
}: {
  client: TypedSupabaseClient;
  id: number;
}) {
  return client
    .from("properties")
    .select("*, video_tour(*)")
    .eq("id", id)
    .throwOnError()
    .single();
}

export function getFavouriteById({
  client,
  id,
  user
}: {
  client: TypedSupabaseClient;
  id: number;
  user: Session["user"] | null;
}) {
  return client
    .from("favourites")
    .select("id, property_id, user_id")
    .eq("user_id", user!?.id)
    .eq("property_id", id)
    .throwOnError()
    .single();
}

export function addFavourite({
  client,
  user,
  property_id
}: {
  client: TypedSupabaseClient;
  user: Session["user"];
  property_id: number;
}) {
  return client
    .from("favourites")
    .insert([{ user_id: user.id, property_id }])
    .throwOnError();
}

export function removeFavourite({
  client,
  user,
  property_id
}: {
  client: TypedSupabaseClient;
  user: Session["user"];
  property_id: number;
}) {
  return client
    .from("favourites")
    .delete()
    .eq("user_id", user.id)
    .eq("property_id", property_id)
    .throwOnError();
}

export function getPropertyTypes({ client }: { client: TypedSupabaseClient }) {
  return client.from("property_types").select("*").throwOnError();
}

export function getLeaseDurations({ client }: { client: TypedSupabaseClient }) {
  return client.from("lease_durations").select("*").throwOnError();
}

export function getAmenities({ client }: { client: TypedSupabaseClient }) {
  return client.from("amenities").select("*").throwOnError();
}
