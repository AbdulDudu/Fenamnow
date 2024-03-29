"use client";

import { PortableText } from "next-sanity";
import articePortableText from "./portable-content";

interface ArticleContentProps {
  ARTICLE_CONTENT: any;
}

const ArticleContent = ({ ARTICLE_CONTENT }: ArticleContentProps) => {
  const body = ARTICLE_CONTENT;
  return (
    <>
      <div className="dark:text-gray-300">
        <PortableText value={body} components={articePortableText} />
      </div>
    </>
  );
};

export default ArticleContent;
