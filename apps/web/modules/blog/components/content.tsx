import ArticleContent from "@web/modules/common/shared/article-content";
import ShareButton from "@web/modules/property/components/share";
import { urlForImage } from "@web/sanity/lib/image";
import Image from "next/image";

export default function BlogContent({
  title,
  publishedAt,
  mainImage,
  body,
  slug,
  author,
  ...props
}: any) {
  console.log(props);
  return (
    <main className="container min-h-screen w-full space-y-8 py-8">
      <div className="relative h-80 w-full">
        <Image
          className="h-full w-full object-cover"
          fill
          alt={title}
          src={urlForImage(mainImage)}
        />
      </div>
      <h2>{title}</h2>

      <div className="flex w-full justify-between">
        <div>
          <p className="font-semibold">Written by - {author.name}</p>
          <p className="font-semibold">
            Published - {new Date(publishedAt).toDateString()}
          </p>
        </div>

        <ShareButton slug={slug.current} />
      </div>

      <div className="text-prose h-max w-full">
        <ArticleContent ARTICLE_CONTENT={body} />
      </div>
    </main>
  );
}
