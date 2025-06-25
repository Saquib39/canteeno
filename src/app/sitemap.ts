import { MetadataRoute } from "next";

export async function GET(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";


  // ✅ Fetch categories and subcategories from your API or DB
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
