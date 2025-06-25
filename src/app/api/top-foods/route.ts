// ✅ /app/api/top-foods/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Order } from "@/models/ordeModel";
import  Food  from "@/models/foodModel";
// import items from "razorpay/dist/types/items";

export async function GET() {
  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last7 = new Date(today);
  last7.setDate(today.getDate() - 6);

  const recent = await Order.find({
    paymentStatus: "paid",
    createdAt: { $gte: last7 },
  }).select("items");

  const countMap = new Map<string, number>();
  recent.forEach((order: any) => {
    order.items?.forEach((it: any) => {
      const name = it.name;
      countMap.set(name, (countMap.get(name) ?? 0) + (it.quantity ?? 0));
      
    });
  });

  const topNames = Array.from(countMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name]) => name);
  
  const foods = await Food.find({ name: { $in: topNames } });

  return NextResponse.json({ success: true, data: foods });
}
