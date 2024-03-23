import { Bucket } from "@fenamnow/types/files";
import { cookies } from "next/headers";
import useSupabaseServer from "../helpers/supabase/server-client";

export const useServerPublicUrl = (
  path: string,
  cookieStore: ReturnType<typeof cookies>,
  bucket?: Bucket
) => {
  const supabase = useSupabaseServer(cookieStore);

  const serverPublicUrl = bucket
    ? `${supabase.storage.from(bucket).getPublicUrl(path)}`
    : `${process.env.SUPABASE_URL}/storage/v1/object/public/${path}`;

  return serverPublicUrl;
};
