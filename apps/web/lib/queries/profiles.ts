import { TypedSupabaseClient } from "../helpers/supabase/supabase";

export function getProfileById({
  client,
  id
}: {
  client: TypedSupabaseClient;
  id: string;
}) {
  return client
    .from("profiles")
    .select("*")
    .eq("id", id)
    .throwOnError()
    .single();
}
