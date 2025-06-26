// File: src/app/sitemap.ts

import { MetadataRoute } from "next";
import connectDB from "@/lib/db";
import MainCategory from "@/models/mainCategoryModel";
import SubCategory from "@/models/subCategoryModel";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Connect to your database
  await connectDB();

  // 2. Load categories directly from MongoDB
  const mainCategories = await MainCategory.find().select("slug updatedAt");
  const subCategories = await SubCategory.find()
    .select("slug mainCategory updatedAt")
    .populate("mainCategory", "slug");

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // 3. Build your static and dynamic routes
  const staticRoutes = ["", "/about", "/contact", "/menu"];
  const dynamicMain = mainCategories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: cat.updatedAt,
  }));
  const dynamicSub = subCategories.map((sub) => ({
    url: `${baseUrl}/category/${sub.mainCategory.slug}/${sub.slug}`,
    lastModified: sub.updatedAt,
  }));

  // 4. Combine and return in MetadataRoute.Sitemap format
  return [
    // static
    ...staticRoutes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date() })),
    // dynamic
    ...dynamicMain,
    ...dynamicSub,
  ];
}
