"only server";

import type { QueryParams } from "@sanity/client";
import { draftMode } from "next/headers";
import { client } from "./client";

const DEFAULT_PARAMS = {} as QueryParams;
const DEFAULT_TAGS = [] as string[];

export async function sanityFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<QueryResponse> {
  const isDraftMode = draftMode().isEnabled;

  const isDevelopment = process.env.NODE_ENV === "development";

  return client
    .withConfig({ useCdn: !isDraftMode })
    .fetch<QueryResponse>(query, params, {
      // cache: "no-store",
      // ...(isDraftMode && {
      //     token: token,
      //     perspective: "previewDrafts",
      // }),

      next: { revalidate: 0 }

      // next: {
      //     tags,
      // },
    });
}
