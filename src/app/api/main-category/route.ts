import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import MainCategory from "@/models/mainCategoryModel";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  try {
    await connectDB();
    const { name, image } = await req.json();

    if (!name || !image) {
      return NextResponse.json(
        { success: false, message: "Name and image required" },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const newCategory = await MainCategory.create({ name, slug, image });

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (err) {
    console.error("❌ Failed to create main category:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ──────────────────────────────── GET: Fetch Categories ──────────────────────────────── */
export async function GET() {
  try {
    await connectDB();
    const categories = await MainCategory.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: categories }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
