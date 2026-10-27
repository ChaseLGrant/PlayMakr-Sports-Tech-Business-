import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/brand";
import { audiences } from "@/lib/audiences";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    ...audiences.map((a) => ({ url: `${siteUrl}/for/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: `${siteUrl}/apply`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
