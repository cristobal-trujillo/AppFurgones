import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/terminos`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];
}
