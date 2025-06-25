// /api/subcat/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import  SubCategory  from "@/models/subCategoryModel";
import  MainCategory  from "@/models/mainCategoryModel";

export async function GET() {
  await connectDB();

  const subcategories = await SubCategory.find(); // get all subcats
  const mainCategories = await MainCategory.find(); // get all mainCats

  // manually match mainCategory.slug
  const enrichedSubcategories = subcategories.map((sub: any) => {
    const mainCat = mainCategories.find(
      (main: any) => main._id.toString() === sub.mainCategory.toString()
    );
    return {
      ...sub._doc,
      mainCategorySlug: mainCat?.slug || null,
    };
  });

  return NextResponse.json({ data: enrichedSubcategories });
}
