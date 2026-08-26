import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://image-convertor.pages.dev";

const ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/heic-to-jpg", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/png-to-jpg", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/jpg-to-webp", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/png-to-webp", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/webp-to-png", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/how-it-works", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
