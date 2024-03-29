import { PageProps } from "@fenamnow/types/global";
import BlogContent from "@web/modules/blog/components/content";
import { urlForImage } from "@web/sanity/lib/image";
import { postQuery } from "@web/sanity/lib/queries";
import { sanityFetch } from "@web/sanity/lib/sanityFetch";
import { Metadata } from "next";
import { SanityDocument } from "next-sanity";

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const article = await sanityFetch<SanityDocument>({
    query: postQuery,
    params
  });

  return {
    title: `${article.title} | Fenamnow`,
    openGraph: {
      type: "article",
      title: `${article.title} | Fenamnow`,
      siteName: "Fenamnow",
      images: [
        {
          url: urlForImage(article.mainImage)
        }
      ]
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const article = await sanityFetch<SanityDocument>({
    query: postQuery,
    params
  });
  return <BlogContent {...article} />;
}
