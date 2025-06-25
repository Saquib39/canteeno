import {Order} from "@/models/ordeModel"; // or wherever your model is
import connectDB from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
   if (!token || token.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );
  }

  await connectDB();

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  // ↙ generate the last 7 days (oldest → newest)
  const dailyTotals: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    dailyTotals[key] = 0;
  }

  // 🔑 use your real paid‑flag
  const orders = await Order.find({
    paymentStatus: "paid",               // ← CHANGE
    createdAt: { $gte: sevenDaysAgo },
  }).select("createdAt amount");

  // add each order into its bucket
  for (const order of orders) {
    const key = new Date(order.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
    if (dailyTotals[key] !== undefined) {
      dailyTotals[key] += order.amount ?? 0;        // your amount field
    }
  }

  const result = Object.entries(dailyTotals).map(([date, total]) => ({
    date,
    total,
  }));

  return NextResponse.json({ data: result });
}
