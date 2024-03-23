"use client";

import { Bucket } from "@fenamnow/types/files";
import { useEffect, useState } from "react";
import useSupabaseBrowser from "../helpers/supabase/browser-client";
import { isValidUrl } from "../utils/is-valid-url";

export const useClientPublicUrls = (path: string, bucket?: Bucket) => {
  const supabase = useSupabaseBrowser();
  const [publicUrl, setPublicUrl] = useState<string>("");

  useEffect(() => {
    if (path?.length == 0) {
      setPublicUrl("");
      return;
    }
    if (isValidUrl(path)) {
      setPublicUrl(path);
    } else if (bucket) {
      setPublicUrl(
        decodeURI(
          supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
        )
      );
    } else {
      setPublicUrl(
        `https://${process.env.NEXT_PUBLIC_SUPABASE_DOMAIN}/storage/v1/object/public/${path}`
      );
    }
  }, [path, bucket, supabase.storage]);

  return publicUrl;
};
