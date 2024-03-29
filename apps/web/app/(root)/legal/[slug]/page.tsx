import { SanityDocument } from "@sanity/client";
import ArticleContent from "@web/modules/common/shared/article-content";
import { getLegalQuery } from "@web/sanity/lib/queries";
import { sanityFetch } from "@web/sanity/lib/sanityFetch";
import { format } from "date-fns";
import { Metadata } from "next";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const legal = await sanityFetch<SanityDocument>({
    query: getLegalQuery,
    params
  });
  if (!legal)
    return {
      title: "Not Found",
      description: "The page is not found"
    };

  return {
    title: legal?.title,
    description: legal?.meta_description
  };
}

const Legal = async ({ params }: { params: { slug: string } }) => {
  const legal = await sanityFetch<SanityDocument>({
    query: getLegalQuery,
    params
  });
  return (
    <>
      <section className="m-4 mt-20 md:mt-10">
        <div className="container flex items-center justify-center px-0 pb-[20px] pt-[10px] md:px-[15px]">
          {!legal ? (
            <p>No Legal Found</p>
          ) : (
            <>
              <div className="h-full w-full lg:w-[60%]">
                <h3>{legal.title}</h3>
                <ArticleContent ARTICLE_CONTENT={legal?.content} />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Legal;
