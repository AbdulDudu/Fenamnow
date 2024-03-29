import { urlFor } from "@web/lib/utils/sanity-utils";
import { urlForImage } from "@web/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";

export default function BlogCard({
  title,
  author,
  publishedAt,
  slug,
  mainImage
}: any) {
  console.log(mainImage);
  return (
    <div className="hover:bg-accent bg-accent/50 flex h-80 w-full flex-col justify-between space-y-2 rounded-xl p-4 transition-colors ease-in-out">
      {/* Header photo */}
      <div className="bg-background relative h-[60%] w-full rounded-md">
        <Link href={`/blog/${slug.current}`}>
          <Image
            className="h-full w-full rounded-md object-cover"
            src={urlForImage(mainImage.asset._ref) || ""}
            fill
            alt="blog image"
          />
        </Link>
      </div>
      {/* Title */}
      <p className="text-xl font-semibold">{title}</p>
      {/* Brief description */}
      <div className="flex items-center justify-between">
        {/* Author */}
        <p>
          By{" "}
          <Link href="/" className="font-semibold underline">
            {author?.name}
          </Link>
        </p>
        {/* Publish date */}
        <p className="font-semibold">{new Date(publishedAt).toDateString()}</p>
      </div>
    </div>
  );
}
