import { MetadataRoute } from "next";

export async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const catRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/main-category`);
  const subRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sub-category`);

  const mainCategories = await catRes.json();
  const subCategories = await subRes.json();

  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/menu",
  ];

  const dynamicRoutes = [
    ...mainCategories.data.map((cat: any) => `/category/${cat.slug}`),
    ...subCategories.data.map((sub: any) => `/category/${sub.mainCategory.slug}/${sub.slug}`),
  ];

  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}

// ✅ Correct export for App Router sitemap.ts
export const sitemap = generateSitemap;
