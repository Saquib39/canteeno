// src/app/api/food/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SubCategory from "@/models/subCategoryModel";
import MainCategory from "@/models/mainCategoryModel";
import Food from "@/models/foodModel";
import { getToken } from "next-auth/jwt";          // 🔑 add

/* ─────────────────────── POST: Create food (admin only) ─────────────────────── */
export async function POST(req: NextRequest) {
  /* 1. Admin check */
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ success: false, msg: "Unauthorized" }, { status: 403 });
  }

  try {
    await connectDB();
    const {
      name,
      image,
      description,
      price,
      offerPrice,
      mainCategoryId,
      subCategoryId,
    } = await req.json();

    if (
      !name?.trim() ||
      !image ||
      !description?.trim() ||
      !price ||
      !mainCategoryId ||
      !subCategoryId
    ) {
      return NextResponse.json(
        { success: false, msg: "All required fields must be provided" },
        { status: 400 }
      );
    }

    /* Parent / child validation */
    const mainCat = await MainCategory.findById(mainCategoryId);
    const subCat = await SubCategory.findById(subCategoryId);

    if (!mainCat || !subCat) {
      return NextResponse.json(
        { success: false, msg: "Invalid category selection" },
        { status: 400 }
      );
    }
    if (String(subCat.mainCategory) !== String(mainCat._id)) {
      return NextResponse.json(
        { success: false, msg: "Sub‑category does not belong to chosen main category" },
        { status: 400 }
      );
    }

    /* Duplicate check */
    const dup = await Food.findOne({ name: name.trim(), subCategory: subCat._id });
    if (dup) {
      return NextResponse.json(
        { success: false, duplicate: true, msg: "Food already exists in this sub‑category" },
        { status: 409 }
      );
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const food = await Food.create({
      name,
      slug,
      image,
      description,
      price,
      offerPrice,
      mainCategory: mainCat._id,
      subCategory: subCat._id,
    });

    return NextResponse.json({ success: true, data: food }, { status: 201 });
  } catch (err) {
    console.error("❌ Food create failed:", err);
    return NextResponse.json({ success: false, msg: "Server error" }, { status: 500 });
  }
}

/* ─────────────────────── GET: List foods (public) ─────────────────────── */
export async function GET(req: NextRequest) {
  await connectDB();

  const subSlug = req.nextUrl.searchParams.get("subSlug");
  let filter = {};

  if (subSlug) {
    const sub = await SubCategory.findOne({ slug: subSlug });
    if (sub) {
      filter = { subCategory: sub._id };
    } else {
      return NextResponse.json({ success: true, data: [] });
    }
  }

  const foods = await Food.find(filter)
    .populate("mainCategory", "name slug")
    .populate("subCategory", "name slug")
    .sort({ createdAt: -1 });

  return NextResponse.json({ success: true, data: foods });
}
