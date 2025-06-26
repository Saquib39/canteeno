// app/api/order/[id]/update-status/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Order } from "@/models/ordeModel";        // ensure correct path
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Params = { id: string };

// ─── PATCH ─── Update Order Status ───────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  await connectDB();

  const { status } = await req.json();
  const order = await Order.findById(id);
  if (!order) {
    return NextResponse.json(
      { success: false, message: "Order not found" },
      { status: 404 }
    );
  }

  order.orderStatus = status;
  await order.save();

  return NextResponse.json({ success: true, data: order });
}

// ─── GET ─── List Unpaid Orders (Admin Only) ────────────────────────
export async function GET(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const orders = await Order.find({ paymentStatus: "unpaid" }).sort({
    createdAt: -1,
  });

  return NextResponse.json({ success: true, data: orders });
}
