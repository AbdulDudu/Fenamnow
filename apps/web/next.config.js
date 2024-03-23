/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "olyqwduovxprfhgeastn.supabase.co" },
      { protocol: "https", hostname: "play.google.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "cdn.sanity.io" }
    ]
  },
  transpilePackages: ["@fenamnow/ui"],
  logging: {
    fetches: {
      fullUrl: false
    }
  }
};

module.exports = nextConfig;
