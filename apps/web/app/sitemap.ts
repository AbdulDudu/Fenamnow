import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://fenamnow.com",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1
    },
    {
      url: "https://fenamnow.com/login",
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 1
    },
    {
      url: "https://fenamnow.com/register",
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 1
    },
    {
      url: "https://fenamnow.com/search/rental?page=1",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: "https://fenamnow.com/search/sale?page=1",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: "https://fenamnow.com/search/lease?page=1",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: "https://fenamnow.com/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}
