"use client";

import { SanityDocument } from "@sanity/client/csm";
import BlogCard from "../components/card";

export default function BlogScreen({ articles }: { articles: SanityDocument }) {
  return (
    <main className="container flex min-h-screen w-full flex-col space-y-4 py-8">
      <div className="my-4">
        <h2>Explore our blog</h2>
      </div>
      <p>Some write-ups from our team</p>

      {/* <div className="space-y-4">
        <h3>Featured posts</h3>
        <div className="h-80 w-full border border-red-500"></div>
      </div> */}
      <div className="grid h-screen w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.length > 0 &&
          articles.map((article: any) => (
            <BlogCard key={article.slug} {...article} />
          ))}
      </div>
    </main>
  );
}
