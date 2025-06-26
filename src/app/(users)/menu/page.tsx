// File: src/app/(users)/menu/page.tsx

import connectDB from "@/lib/db";
import SubCategory from "@/models/subCategoryModel";
import MenuGrid from "./MenuGrid";
import type { Types } from "mongoose";

// Define the exact shape returned by .lean()
interface SubCatDoc {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  image: string;
  mainCategory: { slug: string };
}

interface SubCat {
  _id: string;
  name: string;
  slug: string;
  mainCategorySlug: string;
  image: string;
}

// 🔑 SEO metadata
export const metadata = {
  title: "Menu | Canteeno",
  description:
    "Browse every food category served at Canteeno — fresh, tasty and student-friendly.",
  openGraph: {
    title: "Menu | Canteeno",
    description:
      "Browse every food category served at Canteeno — fresh, tasty and student-friendly.",
    images: ["/og/menu.png"],
  },
};

// 🔄 Revalidate every 10 min (ISR)
export const revalidate = 600;

export default async function MenuPage() {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Fetch sub-categories with precise typing
  const subsRaw = await SubCategory.find()
    .sort({ name: 1 })
    .lean<SubCatDoc[]>();

  // 3. Map to the shape MenuGrid expects
  const subs: SubCat[] = subsRaw.map((sub) => ({
    _id: sub._id.toString(),
    name: sub.name,
    slug: sub.slug,
    mainCategorySlug: sub.mainCategory.slug,
    image: sub.image,
  }));

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1
        className="mb-10 text-center text-4xl font-extrabold tracking-tight
                   bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-300
                   bg-clip-text text-transparent"
      >
        Explore Our Menu
      </h1>

      {subs.length ? (
        <MenuGrid subs={subs} />
      ) : (
        <p className="py-10 text-center text-gray-600">
          No sub-categories found.
        </p>
      )}
    </main>
  );
}
