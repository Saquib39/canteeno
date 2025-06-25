import { NextResponse,NextRequest } from "next/server";
import { Order } from "@/models/ordeModel";
import connectDB from "@/lib/db";
import { getToken } from "next-auth/jwt";
export async function GET(req: NextRequest) {
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  //    if (!token || token.role !== "admin") {
  //     return NextResponse.json(
  //       { success: false, message: "Unauthorized" },
  //       { status: 403 }
  //     );
  //   }


  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  /* 1. DAILY SALES: for last 7 days */
  const dailyTotals: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    dailyTotals[key] = 0;
  }

  const recentOrders = await Order.find({
    paymentStatus: "paid",
    createdAt: { $gte: sevenDaysAgo },
  }).select("createdAt amount items");

  for (const order of recentOrders) {
    const key = new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
    if (dailyTotals[key] !== undefined) {
      dailyTotals[key] += order.amount ?? 0;
    }
  }

  const daily = Object.entries(dailyTotals).map(([date, total]) => ({ date, total }));

  /* 2. Pie Chart: Order Status */
  const paidCount = await Order.countDocuments({ paymentStatus: "paid" });
  const unpaidCount = await Order.countDocuments({ paymentStatus: "unpaid" });
  const status = [
    { name: "Paid", value: paidCount },
    { name: "Unpaid", value: unpaidCount },
  ];

  /* 3. Top-Selling Items */
  const itemMap = new Map<string, number>();
  recentOrders.forEach((order: any) => {
    (order.items || []).forEach((it: any) => {
      const key = it.name ?? "Unknown";
      itemMap.set(key, (itemMap.get(key) ?? 0) + (it.quantity ?? 0));
    });
  });

  const topItems = Array.from(itemMap.entries())
    .map(([item, sold]) => ({ item, sold }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  /* ✅ 4. TOTAL REVENUE (All Time) */
  const allPaidOrders = await Order.find({ paymentStatus: "paid" }).select("amount");
  const totalRevenue = allPaidOrders.reduce((sum, order) => sum + (order.amount ?? 0), 0);

  return NextResponse.json({
    daily,
    status,
    topItems,
    totalRevenue,
  });
}
