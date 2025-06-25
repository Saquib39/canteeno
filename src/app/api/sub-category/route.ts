import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import MainCategory from "@/models/mainCategoryModel";
import SubCategory from "@/models/subCategoryModel";
import { getToken } from "next-auth/jwt"; // 🔐 Import for admin check

// ─────────────── POST: Create SubCategory (Admin Only) ───────────────
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    await connectDB();
    const { name, image, mainCategoryId } = await req.json();

    if (!name || !image || !mainCategoryId) {
      return NextResponse.json(
        { success: false, message: "Name, image and mainCategoryId required" },
        { status: 400 }
      );
    }

    const parent = await MainCategory.findById(mainCategoryId);
    if (!parent) {
      return NextResponse.json(
        { success: false, message: "Main category not found" },
        { status: 404 }
      );
    }

    const exists = await SubCategory.findOne({
      name: name.trim(),
      mainCategory: mainCategoryId,
    });

    if (exists) {
      return NextResponse.json(
        { success: false, duplicate: true },
        { status: 409 }
      );
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const newSub = await SubCategory.create({
      name,
      slug,
      image,
      mainCategory: mainCategoryId,
    });

    return NextResponse.json({ success: true, data: newSub }, { status: 201 });
  } catch (err) {
    console.error("❌ Failed to create sub category:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─────────────── GET: Publicly Fetch SubCategories ───────────────
export async function GET() {
  try {
    await connectDB();
    const subs = await SubCategory.find()
      .populate("mainCategory", "slug name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: subs }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch sub‑categories" },
      { status: 500 }
    );
  }
}
