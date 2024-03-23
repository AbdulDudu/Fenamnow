import { Database } from "@fenamnow/types/database";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../helpers/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Retrieves the profile data for a given session.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Session | null} params.session - The session object.
 * @return {Promise<{ data: Profile[] | null; error: any }>} - The profile data and error.
 */
export const getUserProfile = async ({
  session
}: {
  session?: Session | null | undefined;
}): Promise<{ data: Profile | null; error: any }> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session?.user?.id as string)
    .single();

  return { data, error };
};

/**
 * Finds the profile associated with the given email address.
 *
 * @param {string} email - The email address to search for.
 * @return {Promise<{ data: Profile | null; error: any }>} - A promise that resolves to an object containing the profile data and any error encountered during the search.
 */
export const findProfileByEmail = async ({
  email
}: {
  email: string;
}): Promise<{ data: Profile | null; error: any }> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  return { data, error };
};

export const getProfileById = async ({
  id
}: {
  id: string;
}): Promise<{ data: Profile | null; error: any }> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
};
