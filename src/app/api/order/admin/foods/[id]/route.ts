// File: /app/api/admin/foods/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/db";
import Food from "@/models/foodModel";

type Params = { id: string };

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    await connectDB();
    await Food.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Food deleted" });
  } catch (err) {
    console.error("❌ Delete error", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
