import { SanityDocument } from "@sanity/client/csm";
import BlogScreen from "@web/modules/blog/screens";
import { postsQuery } from "@web/sanity/lib/queries";
import { sanityFetch } from "@web/sanity/lib/sanityFetch";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Fenamnow",
  description: "Articles from the Fenamnow team"
};
export default async function BloagPage() {
  const articles = await sanityFetch<SanityDocument>({
    query: postsQuery
  });

  return <BlogScreen articles={articles} />;
}
