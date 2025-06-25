// File: /app/api/admin/foods/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/db";
import  Food  from "@/models/foodModel";

export async function GET(req: NextRequest) {
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // if (!token || token.role !== "admin") {
  //   return NextResponse.json(
  //     { success: false, message: "Unauthorized" },
  //     { status: 403 }
  //   );
  // }

  try {
    await connectDB();
    const foods = await Food.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: foods });
  } catch (err) {
    console.error("❌ Error fetching foods", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
