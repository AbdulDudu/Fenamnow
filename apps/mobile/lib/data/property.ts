import { Database } from "@fenamnow/types/database";
import {
  PostgrestError,
  PostgrestSingleResponse,
  Session
} from "@supabase/supabase-js";
import { number } from "zod";
import { supabase } from "../helpers/supabase";

export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type Favourite = Database["public"]["Tables"]["favourites"]["Row"];
export type ListingType = Database["public"]["Enums"]["listing_type"];
export type PropertyType =
  Database["public"]["Tables"]["property_types"]["Row"];
export type LeaseDurationTypes =
  Database["public"]["Tables"]["lease_durations"]["Row"];
export type PropertyStatus = Database["public"]["Enums"]["property_status"];
/**
 * Retrieves all property types from the database.
 *
 * @returns {Promise<PostgrestSingleResponse<Array<{ created_at: string; id: string; name: string; }>>>}
 * A Promise that resolves to an array of property types.
 */
export const getPropertyTypes = async (): Promise<
  PostgrestSingleResponse<
    Array<{
      created_at: string;
      id: string;
      name: string;
    }>
  >
> => {
  // Retrieve all property types from the 'property_types' table
  return await supabase.from("property_types").select("*");
};

/**
 * Retrieves all property listing types from the 'listing_types' table.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of listing types.
 */
export const getPropertyListingTypes = async (): Promise<
  PostgrestSingleResponse<
    {
      created_at: string; // The created date of the listing type.
      id: string; // The unique identifier of the listing type.
      name: string; // The name of the listing type.
    }[]
  >
> => {
  return await supabase.from("listing_types").select("*");
};

/**
 * Retrieves all the lease duration types from the 'lease_duration_types' table.
 *
 * @return {Promise<Array<any>>} A promise that resolves to an array of lease duration types.
 */
export const getPropertyLeaseDurations = async (): Promise<
  PostgrestSingleResponse<
    {
      created_at: string;
      id: string;
      name: string;
    }[]
  >
> => {
  return await supabase.from("lease_durations").select("*");
};

/**
 * Retrieves properties from the database.
 *
 * @param {Session | null} session - The user session.
 * @param {number} [start=0] - The start index of the range.
 * @param {number} [end=8] - The end index of the range.
 * @param {'lease' | 'rental' | 'sale'} [listingType] - The listing type of the properties.
 * @returns {Promise<{
 *  data: Property[] | null;
 *  error: any;
 *  count: number | null;
 *  hasNextPage: boolean;
 * }>} - The properties that match the query.
 */
export const getProperties = async ({
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
}): Promise<{
  data: Property[] | null;
  error: any;
  count: number | null;
  hasNextPage: boolean;
}> => {
  // Create the initial query
  let query = supabase
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
  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(start, end);

  // Determine if there is a next page based on the data length and the total count
  const hasNextPage = end! < count!;
  // Return the retrieved data along with the error, count, and hasNextPage
  return { data, error, count, hasNextPage };
};

/**
 * Retrieves a property by its ID from the 'properties' table.
 *
 * @param {{ id: number }} params - The ID of the property to retrieve.
 * @returns {{ data: any, error: any }} - The property data and any error that occurred during retrieval.
 */
export const getPropertyById = async ({ id }: { id: number }) => {
  const { data, error } = await supabase
    .from("properties")
    .select("*, video_tour(*)")
    .eq("id", id)
    .single();

  return { data, error };
};

/**
 * Upserts a property into the 'properties' table.
 * @param data The property data to be upserted.
 * @returns An object containing any error that occurred during the upsert.
 */
export const upsertProperty = async (
  data: Property
): Promise<{
  propertyData: Property | null;
  error: PostgrestError | null;
}> => {
  const { data: propertyData, error } = await supabase
    .from("properties")
    .upsert({
      ...data
    })
    .select()
    .single();

  if (error) throw error;

  return { propertyData, error };
};

export const deleteProperty = async (
  id: number
): Promise<{
  error: PostgrestError | null;
}> => {
  const { error } = await supabase.from("properties").delete().eq("id", id);
  return { error };
};

/**
 * Adds a property to the user's favorites.
 *
 * @param {string} id - The ID of the property to add to favorites.
 * @param {Session} session - The user session.
 * @returns {Promise<{ error: PostgrestError | null }>} - An object with the error property if there was an error.
 */
export const addToFavorites = async ({
  id,
  session
}: {
  id: number;
  session: Session;
}): Promise<{
  data: Favourite | null;
  error: PostgrestError | null;
}> => {
  // Insert the property ID and user ID into the favorites table

  const { data, error } = await supabase
    .from("favourites")
    .upsert([{ property_id: id, user_id: session.user.id }])
    .select()
    .single();

  // Return the error, if any
  return { data, error };
};

/**
 * Removes a property from the user's favorites.
 *
 * @param id - The ID of the property to be removed.
 * @param session - The user's session object.
 * @returns An object with an error property.
 */
export const removeFromFavorites = async ({
  id
}: {
  id: number;
}): Promise<{
  error: PostgrestError | null;
}> => {
  // Delete the property from the favorites table
  const { error } = await supabase
    .from("favourites")
    .delete()
    .eq("property_id", id);
  return { error };
};

/**
 * Retrieves the favorite items for a given user session.
 * @param session - The user session object.
 * @returns An object containing the favorite data and any error that occurred.
 */
export const getFavorites = async ({
  session = null,
  start = 0,
  end = 8
}: {
  session?: Session | null | undefined;
  start?: number;
  end?: number;
}) => {
  // Retrieve the favorite items from the 'favorites' table for the current user
  const { data, error, count } = await supabase
    .from("favourites")
    .select("*, property_id(*)", { count: "planned" })
    .eq("user_id", session?.user.id!)
    .range(start, end);

  const hasNextPage = end! < count!;

  // Return the retrieved data and any error that occurred
  return { data, error, count, hasNextPage };
};

export const findFavourite = async ({
  id,
  session
}: {
  id: number;
  session: Session | null;
}): Promise<{
  data: Favourite | null;
  error: PostgrestError | null;
}> => {
  // Retrieve the favorite items from the 'favorites' table for the current user
  const { data, error } = await supabase
    .from("favourites")
    .select("*")
    .eq("property_id", id)
    .eq("user_id", session?.user.id!)
    .single();
  // Return the retrieved data and any error that occurred
  return { data, error };
};

export const getAmenities = async () => {
  const { data, error } = await supabase.from("amenities").select("*");
  // Return the retrieved data and any error that occurred
  return { data, error };
};

export const getHigestPrice = async (listing_type?: string) => {
  const query = supabase
    .from("properties")
    .select("price")
    .order("price", { ascending: false });
  listing_type && query.eq("listing_type", listing_type);
  return await query;
};

export const getLowestPrice = async (listing_type?: string) => {
  const query = supabase.from("properties").select("price");
  listing_type && query.eq("listing_type", listing_type);
  return await query;
};

export const updatePropertyStatus = async ({
  id,
  status
}: {
  id: number;
  status: PropertyStatus;
}) => {
  return await supabase.from("properties").update({ status }).eq("id", id);
};
