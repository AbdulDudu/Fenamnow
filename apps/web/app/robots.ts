import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/agent-verification/",
          "reset-password/",
          "/dashboard/",
          "/profile/",
          "/properties/",
          "/settings/",
          "/chat/",
          "/studio/",
          "/api/"
        ]
      }
    ],

    sitemap: "https://fenamnow.com/sitemap.xml"
  };
}
