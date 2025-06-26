// app/api/order/[id]/order-paid/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Order } from "@/models/ordeModel";
import { getToken } from "next-auth/jwt";

// ─────────────── POST: Mark Order as Paid ───────────────
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Unwrap params promise
  const { id } = await params;

  await connectDB();

  // 🔐 Auth check
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.sub) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // ✅ Find and verify ownership
  const order = await Order.findById(id);
  if (!order || order.user.toString() !== token.sub) {
    return NextResponse.json(
      { success: false, message: "Order not found" },
      { status: 404 }
    );
  }

  // ✅ Update payment status
  order.paymentStatus = true;
  await order.save();

  return NextResponse.json({ success: true, data: order });
}

// ─────────────── GET: List Paid Orders ───────────────
export async function GET() {
  await connectDB();
  const orders = await Order.find({ paymentStatus: true }).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: orders });
}

// ─────────────── PATCH: Mark Order Paid (Admin) ───────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();

  try {
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    order.paymentStatus = true;
    await order.save();

    return NextResponse.json({ success: true, message: "Order marked as paid" });
  } catch (err) {
    console.error("❌ Error marking order paid:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
